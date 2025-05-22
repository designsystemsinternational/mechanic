import * as HME from "h264-mp4-encoder";
import { clamp } from "./mechanic-utils.js";
import { MechanicError } from "./mechanic-error.js";

/**
 * Handles the export of animated design functions into
 * h264 file format.
 *
 * This is achieved using a WASM build of the public domain
 * minih264 encoder, a well as the MPL 1.1 licensed libmp4v2
 * mp4 multiplexer.
 *
 * @typedef {Object} H264WriterOptions
 * @property {number} frameRate
 * @property {number} quantizationParameter
 * @property {number} keyFramePeriod
 * @property {number} speed
 */
export class H264Writer {
  /**
   * @constructor
   * @constructor {H264WriterOptions} options
   */
  constructor({
    frameRate,
    keyFramePeriod,
    quantizationParameter,
    speed
  } = {}) {
    this.frameRate = frameRate;
    this.quantizationParameter = clamp(10, 51, quantizationParameter);
    this.speed = clamp(0, 10, speed);
    this.keyFramePeriod = keyFramePeriod;
    this.encoder = null;
    this.frames = [];
    this.width = null;
    this.height = null;
  }

  /**
   * Handles adding a single frame to the video.
   *
   * @params {HTMLCanvasElement} canvas
   */
  async addFrame(canvas) {
    const { width, height } = canvas;

    // Lossy video encoders ofter work by splitting the image into smaller
    // blocks, creating a problem when the videos dimensions are odd numbers.
    // The h264 coded will fail when given non-even dimensions.
    //
    // See: https://community.adobe.com/t5/after-effects-discussions/media-encoder-is-changing-my-dimension-by-a-pixel/m-p/10100400
    //
    // TODO: We should probably find a way to output this error into the
    // UI directly, instead of it going to the console. We could also
    // cheat and round the dimensions to even numbers here, but that would
    // output a video different from what user expects they are going to get.
    if (!(width % 2 === 0 && height % 2 === 0)) {
      throw new MechanicError(
        `Width and height must be even numbers for the h264 encoder, got ${width}x${height}. If you need to export at this dimensions try using webM or ZIP export.`
      );
    }

    const ctx = canvas.getContext("2d");
    const frameData = ctx.getImageData(0, 0, width, height);
    this.frames.push(frameData);

    if (!this.width || !this.height) {
      this.width = width;
      this.height = height;
    }
  }

  /**
   * Finalizes the video encoding and returns a blob
   *
   * @returns {Promise<Blob>}
   */
  async complete() {
    this.encoder = await HME.createH264MP4Encoder();

    this.encoder.width = this.width;
    this.encoder.height = this.height;
    this.encoder.frameRate = this.frameRate;
    this.encoder.quantizationParameter = this.quantizationParameter;
    this.encoder.groupOfPictures = this.keyFramePeriod;
    this.encoder.speed = this.speed;
    this.encoder.initialize();

    for (const frame of this.frames) {
      const { data } = frame;
      this.encoder.addFrameRgba(data);
    }

    this.encoder.finalize();

    const buffer = this.encoder.FS.readFile(this.encoder.outputFilename);
    const blob = new Blob([buffer], { type: "video/mp4" });

    return blob;
  }
}
