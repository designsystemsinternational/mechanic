import seedrandom from "seedrandom";
import { download } from "./download.js";
import { WebMWriter } from "./webm-writer.js";
import {
  isSVG,
  isCanvas,
  validateEl,
  supportsFormatWebP,
  svgAppendStyles,
  svgOptimize,
  svgPrepare,
  svgToDataUrl,
  htmlToDataUrl,
  htmlToCanvas,
  extractSvgSize,
  dataUrlToCanvas,
  getTimeStamp
} from "./mechanic-utils.js";
import { MechanicError } from "./mechanic-error.js";

/**
 * A class to run Mechanic design functions
 */
export class Mechanic {
  /**
   * Mechanic class constructor
   * @param {object} settings - Settings from the design function
   * @param {object} baseValues - Values for some or all of the design function inputs
   */
  constructor(settings, baseValues, config) {
    const values = Object.assign({}, baseValues);
    const { lastRun, boundingClient, scale, randomSeed } = config;

    const persistRandomOnExport =
      !settings.hasOwnProperty("persistRandomOnExport") || settings.persistRandomOnExport;
    // Sets random seed
    values._randomSeed = randomSeed;
    if (persistRandomOnExport) {
      if (randomSeed === undefined) {
        values._randomSeed = seedrandom(null, { global: true });
      }
      seedrandom(values._randomSeed, { global: true });
    }

    // Add ratio and original values if width and height are inputs
    if (values.width && values.height) {
      values._width = values.width;
      values._height = values.height;
      values._ratio = 1;

      // Calculate new width, height and ratio if scale down to fit is active
      if (scale) {
        const bounds = {
          width: boundingClient.width - 100,
          height: boundingClient.height - 100
        };
        const ratioWidth = bounds.width ? bounds.width / values.width : 1;
        const ratioHeight = bounds.height ? bounds.height / values.height : 1;
        if (ratioWidth < 1 || ratioHeight < 1) {
          const ratio = ratioWidth < ratioHeight ? ratioWidth : ratioHeight;
          values.width = Math.floor(values.width * ratio);
          values.height = Math.floor(values.height * ratio);
          values._ratio = ratio;
        }
      }
    }

    this.settings = {
      frameRate: settings.frameRate || 60,
      videoQuality: settings.videoQuality || 0.95,
      ...settings
    };

    this.values = values;
    this.functionState = lastRun?.functionState ?? {};

    // Validate the settings
    this.validateSettings();
  }

  /**
   * Helper function to validate settings
   * Throws an exception if invalid settings
   * are applied.
   */
  validateSettings() {
    // Validates that quality is within 0–0.99
    //
    // 1 isn't a working value for the webm-writer we use, as it doesn't support
    // losless export. The webm-writer clamps the quality value, so passing 1 to
    // it would technically work. But this way is more transparent towards the
    // users. We currently do not support losless video export.
    if (this.settings.videoQuality < 0 || this.settings.videoQuality > 0.99) {
      throw new MechanicError(
        `The given videoQuality setting (${this.settings.videoQuality}) does not match the expected range (0–0.99)`
      );
    }
  }

  /**
   * Returns an object with common functions to be used in the design function
   * @param {function} frame - The frame function
   * @param {function} done - The done function
   */
  callbacks(frame, done) {
    return {
      frame,
      done
      //requestAnimationFrame:
    };
  }

  /**
   * Register a frame for an animated design function
   * @param {SVGElement|HTMLCanvasElement} el - Element with the current drawing state of the design function
   * @param {Object} extras  - object containing extra elements needed by some engines
   */
  async frame(el, extras = {}) {
    if (!this.settings.animated) {
      throw new MechanicError("The frame() function can only be used for animations");
    }
    if (!supportsFormatWebP()) {
      throw new MechanicError(
        "Your running browser doesn't support WebP generation. Try using Chrome for exporting."
      );
    }

    const err = validateEl(el);
    if (err) {
      throw new MechanicError(err);
    }

    // Init values if needed. Is it slow to do this on the first frame?
    // We put it here because constructor would create objects not needed for preview
    if (!this.exportInit) {
      this.exportInit = true;
      this.serializer = new XMLSerializer();
      this.videoWriter = new WebMWriter({
        quality: this.settings.videoQuality,
        frameRate: this.settings.frameRate
      });
    }

    if (isSVG(el)) {
      // Because drawing an SVG to canvas is asynchronous,
      // We wait until the end to render it all.
      // TODO: This needs to be revisited.
      if (!this.svgFrames) {
        this.svgFrames = [];
      }

      el = svgAppendStyles(el, extras.head);

      this.svgFrames.push(svgToDataUrl(svgPrepare(el, this.serializer)));
      if (!this.svgSize) {
        this.svgSize = extractSvgSize(el);
      }
    } else if (isCanvas(el)) {
      this.videoWriter.addFrame(el);
    } else {
      // This is slow. We should find a more efficient way
      const frame = await htmlToCanvas(el);
      this.videoWriter.addFrame(frame);
    }
    this.frameCalled = true;
  }

  /**
   * Finish a static or animated design function
   * @param {SVGElement|HTMLCanvasElement|HTMLElement} el - Element with the current drawing state of the design function
   * @param {Object} extras  - object containing extra elements needed by some engines
   */
  async done(el, extras = {}) {
    if (!this.settings.animated) {
      if (isSVG(el)) {
        el = svgAppendStyles(el, extras.head);

        this.serializer = new XMLSerializer();

        let svgString = svgPrepare(el, this.serializer);

        if (this.settings.optimize !== false) {
          svgString = svgOptimize(svgString, this.settings.optimize);
        }
        this.svgData = svgToDataUrl(svgString);
      } else if (isCanvas(el)) {
        this.canvasData = el.toDataURL();
      } else {
        this.htmlData = await htmlToDataUrl(el);
      }
    } else {
      if (!supportsFormatWebP()) {
        throw new MechanicError(
          "Your running browser doesn't support WebP generation. Try using Chrome for exporting."
        );
      }
      if (!this.frameCalled) {
        throw new MechanicError("Animated export only called done, frame() hasn't been called.");
      }
      if (isSVG(el)) {
        // This is slow. We should figure out a way to draw into canvas on every frame
        // or at least do Promise.all
        const cacheCanvas = document.createElement("canvas");
        cacheCanvas.width = this.svgSize.width;
        cacheCanvas.height = this.svgSize.height;
        for (let i = 0; i < this.svgFrames.length; i++) {
          await dataUrlToCanvas(this.svgFrames[i], cacheCanvas);
          this.videoWriter.addFrame(cacheCanvas);
        }
      }
      this.videoData = await this.videoWriter.complete();
    }
    this.isDone = true;
  }

  /**
   * Download the output of a design function. Will automatically receive filetype.
   * @param {string} fileName - Name of file to be downloaded.
   * @param {boolean} addTimeStamp - Adds time stamp to name of file to be downloaded.
   */
  download(fileName, addTimeStamp = true) {
    let name = fileName;
    if (addTimeStamp) {
      name += getTimeStamp();
    }
    if (!this.isDone) {
      throw "The download function can only be called after the done() function has finished";
    }
    if (this.svgData) {
      download(this.svgData, `${name}.svg`, "image/svg+xml");
    } else if (this.canvasData) {
      download(this.canvasData, `${name}.png`, "image/png");
    } else if (this.htmlData) {
      download(this.htmlData, `${name}.png`, "image/png");
    } else if (this.videoData) {
      download(this.videoData, `${name}.webm`, "video/webm");
    }
  }

  setState(obj) {
    this.functionState = obj;
  }

  downloadState(fileName, addTimeStamp = true) {
    let name = fileName;
    if (addTimeStamp) {
      name += getTimeStamp();
    }
    if (!this.functionState) {
      throw "The downloadState if a state has been set.";
    }
    download(JSON.stringify(this.functionState), `${name}.json`, "application/json");
  }
}
