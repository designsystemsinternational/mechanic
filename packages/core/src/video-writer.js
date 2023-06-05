import * as MP4Muxer from "mp4-muxer";
import * as WebmMuxer from "webm-muxer";

import { assert, calculateBitrate } from "./mechanic-utils.js";
import { WebMWriter } from "./webm-writer.js";
import { MechanicError } from "./mechanic-error.js";

/**
 * Predefined export settings.
 */
const settings = {
  mp4: {
    multiplexer: MP4Muxer,

    // An MPEG-4 file containing AVC (H.264) video, Main Profile, Level 4.2
    encoderCodec: "avc1.4d002a",
    muxerCodec: "avc",
    mimeType: "video/mp4",
    validateDimensions: (width, height) => {
      // Lossy video encoders ofter work by splitting the image into smaller
      // blocks, creating a problem when the videos dimensions are odd numbers.
      // The h264 coded will fail when given non-even dimensions.
      //
      // See: https://community.adobe.com/t5/after-effects-discussions/media-encoder-is-changing-my-dimension-by-a-pixel/m-p/10100400
      assert(
        width % 2 === 0 && height % 2 === 0,
        `Width and height must be even numbers for the h264 encoder, got ${width}x${height}.`
      );
    }
  },
  webm: {
    multiplexer: WebmMuxer,

    // VP9 is an open source video codec for webM video
    // Youtube is using it for high quality video, so it feels
    // like a safe default.
    //
    // 4:2:0 sampling
    // Level 5.1 (see: https://en.wikipedia.org/wiki/VP9#Levels)
    // 8 bit color
    encoderCodec: "vp09.00.51.08",
    muxerCodec: "V_VP9",
    mimeType: "video/webm",
    validateDimensions: () => { }
  }
};

// Convenience array of allowed formats
const allowedFormats = Object.keys(settings);

/**
 * Handles the export of animated design functions into a video file.
 * Uses the web codec API if the browser supports it, falls back to a
 * pure JavaScript webM encoder if not.
 *
 * @typedef {Object} VideoWriterSettings
 * @property {number} frameRate
 * @property {number|null} bitRate
 * @property {("mp4"|"webm")} format
 */
export class VideoWriter {
  /**
   * @constructor
   * @param {VideoWriterSettings} options
   */
  constructor({ frameRate = 60, bitRate = null, format = "mp4" } = {}) {
    // While the WebCodecs API has fairly good support in modern versions
    // of Chrome, it is still a working draft. So we shouldn't treat it like
    // a browser standard. That’s why we keep the old purely JS based
    // implementation of the webmWriter as a fallback.
    //
    // See: https://caniuse.com/webcodecs
    const supportsWebCodec = "VideoEncoder" in window;

    // If the video codec API is not supported by the current browser
    // but the user wants a webM export, we can fallback to the
    // legacy JS based webM writer.
    if (!supportsWebCodec && format === "webm") {
      console.warn(
        "Your browser does not have support for the VideoEncoder API, falling back to JavaScript version. This might be slower."
      );

      return new WebMWriter({
        frameRate,
        quality: 0.95
      });
    }

    if (!supportsWebCodec) {
      throw new MechanicError(
        `Your running browser doesn’t support exporting video in ${format} format. Try using the latest version of Google Chrome for exporting.`
      );
    }

    if (!allowedFormats.includes(format)) {
      throw new MechanicError(
        `Invalid video format: ${format}. Allowed formats are: ${allowedFormats.join(
          ", "
        )}`
      );
    }

    this.format = format;
    this.options = { frameRate, bitRate };
    this.frameCounter = 0;
    this.multiplexer = null;
  }

  /**
   * Internal utility function that registers an encoded chunk of
   * video with the multiplexer.
   *
   * @param {EncodedVideoChunk} chunk
   * @param {EncodedVideoChunkMetadata} meta
   */
  _handleChunk(chunk, meta) {
    if (!this.multiplexer) {
      throw new MechanicError("No multiplexer found for video chunk");
    }

    this.multiplexer.addVideoChunk(chunk, meta);
  }

  /**
   * Handles adding a single frame to the video.
   *
   * @params {HTMLCanvasElement} canvas
   */
  async addFrame(canvas) {
    // Both the video encode and the multiplexer need to
    // know the dimenions of the video. So we cache them
    // in the instance after looking them up on the passed
    // frame canvas once.
    if (!this.videoWidth || !this.videoHeight) {
      const { width, height } = canvas;
      const { validateDimensions } = settings[this.format];

      validateDimensions(width, height);

      this.videoWidth = width;
      this.videoHeight = height;
    }

    if (!this.multiplexer) {
      const { multiplexer, muxerCodec } = settings[this.format];

      this.multiplexer = new multiplexer.Muxer({
        target: new multiplexer.ArrayBufferTarget(),
        video: {
          codec: muxerCodec,
          width: this.videoWidth,
          height: this.videoHeight
        },
        firstTimestampBehavior: "offset"
      });
    }

    if (!this.encoder) {
      const { encoderCodec } = settings[this.format];

      this.encoder = new VideoEncoder({
        output: this._handleChunk.bind(this),
        error: e => {
          throw new MechanicError(e.message);
        }
      });

      // If the user didn't specify a bitrate we calculate one
      // that’s focused on high output quality.
      const bitrate =
        this.options.bitRate ??
        calculateBitrate(
          this.videoWidth,
          this.videoHeight,
          this.options.frameRate
        );

      const encoderConfig = {
        codec: encoderCodec,
        width: this.videoWidth,
        height: this.videoHeight,
        bitrate: bitrate,
        framerate: this.options.frameRate
      };

      // Support for the Video Codec API does not mean that a browser
      // supports all codecs, so we need to do a second check when the
      // encoder is configured.
      const { supported } = await VideoEncoder.isConfigSupported(encoderConfig);
      if (!supported) {
        throw new MechanicError(
          `Your running browser doesn’t support VideoEncoding using the ${encoderCodec} codec. Try using the latest version of Chrome for exporting.`
        );
      }

      this.encoder.configure(encoderConfig);
    }

    // Timestamp of a video frame should be expressed
    // in micrsoseconds. One microsecond is 1/1,000,000th
    // of a second.
    const timestamp = (this.frameCounter * 1e6) / this.options.frameRate;
    const frame = new VideoFrame(canvas, {
      timestamp
    });

    // Video compression works by not storing a full image
    // for every frame of the video, but instead encoding the
    // difference to the previous frame. Full frames are usually
    // called i-frames or keyframes. While the encoded frames
    // are reffered to as p-frames, before they are predicted.
    //
    // Usually you'd want to keep the number of encoded keyframes
    // as low as possible, because key frames take more file size
    // than predicted frames. But this comes with a tradeoff: A
    // video file that uses a lot of keyframes puts more strain on
    // the CPU that's playing it back, because more image reconstruction
    // has to happen. While this is not a problem for normal playback
    // in a video player this can negatively impact the editing
    // experience when loading the video into video software like
    // Premiere.
    //
    // As we don’t know what users are going to do with video
    // exported from Mechanic we opt for a manual density of
    // keyframes of one keyframe per second of video. This ensures
    // an acceptable editing performance of the video while not
    // consuming as much file size as uncompressed (uncompressed
    // simply means that all frames are keyframes) video.
    this.encoder.encode(frame, {
      keyFrame:
        this.frameCounter === 0 ||
        this.frameCounter % this.options.frameRate === 0
    });

    frame.close();

    this.frameCounter++;
  }

  /**
   * Finalizes the video encoding and returns a blob
   *
   * @returns {Promise<Blob>}
   */
  async complete() {
    await this.encoder.flush();
    this.multiplexer.finalize();

    const { buffer } = this.multiplexer.target;
    const { mimeType } = settings[this.format];
    const blob = new Blob([buffer], { type: mimeType });

    return blob;
  }
}
