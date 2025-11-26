import { FFmpeg } from "@ffmpeg/ffmpeg";

import { MechanicError } from "./mechanic-error.js";

const FFMPEG_BASE_URL = "/ffmpeg";
const FFMPEG_CORE_URL = `${FFMPEG_BASE_URL}/ffmpeg-core.js`;
const FFMPEG_WASM_URL = `${FFMPEG_BASE_URL}/ffmpeg-core.wasm`;

// Presets with different pre-made arguments
// for ffmpeg
const PRESETS = {
  // Fast compression, low quality
  low: [
    "-c:v",
    "libx264",
    "-tag:v",
    "avc1",
    "-movflags",
    "faststart",
    "-crf",
    "40",
    "-preset",
    "ultrafast",
    "-pix_fmt",
    "yuv420p"
  ],
  // Best of both worlds
  medium: [
    "-c:v",
    "libx264",
    "-tag:v",
    "avc1",
    "-movflags",
    "faststart",
    "-crf",
    "30",
    "-preset",
    "superfast",
    "-pix_fmt",
    "yuv420p"
  ],
  // Best quality, slowest compression
  high: [
    "-c:v",
    "libx264",
    "-tag:v",
    "avc1",
    "-movflags",
    "faststart",
    "-crf",
    "23",
    "-preset",
    "fast",
    "-pix_fmt",
    "yuv420p"
  ]
};

/**
 * Handles the export of animated design functions into
 * video file format using a WASM build of ffmpeg.
 *
 * TODO: The wasm build of ffmpeg also includes the VP9
 * Codec (webm), so we could get rid of the old WebM
 * writer and use this as the video file writer.
 * Let’s see how this feels first though, as this comes
 * with the cost of loading about 30MBs of WASM into
 * the client.
 *
 * @typedef {Object} H264WriterOptions
 * @property {number} frameRate
 * @property {'low'|'medium'|'high'|undefined} preset
 * @property {Array<string>|undefined} args
 */
export class FFMpegWriter {
  /**
   * @constructor
   * @constructor {H264WriterOptions} options
   */
  constructor({ frameRate, preset, args = [] } = {}) {
    this.frameRate = frameRate;
    this.preset = preset;
    this.userArgs = args;
    this.frames = [];
    this.width = null;
    this.height = null;

    // Preload the ffmpeg core and wasm files
    // as soon as the H264Writer is created
    // for the first time.
    this._ensurePreloadHeader(FFMPEG_CORE_URL, "script");
    this._ensurePreloadHeader(FFMPEG_WASM_URL, "fetch");
  }

  /**
   * Ensures a preload tag is set
   *
   * @param {string} url
   * @param {string} type
   */
  _ensurePreloadHeader(url, type) {
    const existingPreloads = document.querySelectorAll('link[rel="preload"]');

    for (let link of existingPreloads) {
      if (link.href === url) {
        return;
      }
    }

    const linkElement = document.createElement("link");
    linkElement.rel = "preload";
    linkElement.href = url;
    linkElement.as = type;

    document.head.appendChild(linkElement);
  }

  /**
   * Resolves arguments to send into ffmpeg by eiother
   * using a preset or by using any arguments provided
   * by the user. If present, user arguments will take
   * precedence over the preset.
   */
  _resolveArgs() {
    if (this.userArgs.length > 0) return this.userArgs;
    return PRESETS[this.preset] || PRESETS.medium;
  }

  /**
   * Handles adding a single frame to the video.
   * Capturing a frame works by turning the captured
   * canvas into an Uint8Array of its PNG data.
   *
   * When the video export is ready to be finalized,
   * the individual frames are written into ffmpeg’s virtual
   * filesystem and turned into video from there.
   *
   * TODO: I think this could be improved, by writing the
   * files to ffmpeg's file system immediately, but that
   * would require to wait for the WASM files to be loaded
   * as soon as the video export starts.
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

    const dataURL = canvas.toDataURL("image/png");

    const binaryString = atob(dataURL.split(",")[1]);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    this.frames.push(bytes);

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
    const ffmpeg = new FFmpeg();

    await ffmpeg.load({
      coreURL: FFMPEG_CORE_URL,
      wasmURL: FFMPEG_WASM_URL
    });

    for (let i = 0; i < this.frames.length; i++) {
      const frameName = `tmp/${i.toString().padStart(10, "0")}.png`;
      await ffmpeg.writeFile(frameName, this.frames[i]);
    }

    const args = [
      "-framerate",
      `${this.frameRate}`,
      "-pattern_type",
      "glob",
      "-i",
      "tmp/*.png",
      ...this._resolveArgs(),
      "-y",
      "output.mp4"
    ];

    await ffmpeg.exec(args);

    const data = await ffmpeg.readFile("output.mp4");
    const blob = new Blob([data.buffer], { type: "video/mp4" });

    for (let i = 0; i < this.frames.length; i++) {
      const frameName = `tmp/${i.toString().padStart(10, "0")}.png`;
      await ffmpeg.deleteFile(frameName);
    }

    return blob;
  }
}
