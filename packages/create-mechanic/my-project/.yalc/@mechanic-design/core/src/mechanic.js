import { download } from "./download.js";
import { WebMWriter } from "./webm-writer.js";
import {
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
import * as validation from "./mechanic-validation.js";
import { MechanicError } from "./mechanic-error.js";

/**
 * A class to run Mechanic design functions
 */
export class Mechanic {
  /**
   * Mechanic class constructor
   * @param {object} inputs - Inputs from the design function
   * @param {object} settings - Settings from the design function
   * @param {object} values - Values for some or all of the design function inputs
   */
  constructor(inputs, settings, values) {
    const err1 = validation.validateInputs(inputs);
    if (err1) {
      throw new MechanicError(err1);
    }

    const err2 = validation.validateSettings(settings);
    if (err2) {
      throw new MechanicError(err2);
    }

    const err3 = validation.validateValues(inputs, values);
    if (err3) {
      throw new MechanicError(err3);
    }

    this.inputs = inputs;
    this.settings = settings;
    this.values = validation.prepareValues(inputs, settings, values);
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
    if (!validation.supportsFormatWebP()) {
      throw new MechanicError(
        "Your running browser doesn't support WebP generation. Try using Chrome for exporting."
      );
    }

    const err = validation.validateEl(el);
    if (err) {
      throw new MechanicError(err);
    }

    // Init values if needed. Is it slow to do this on the first frame?
    // We put it here because constructor would create objects not needed for preview
    if (!this.exportInit) {
      this.exportInit = true;
      this.serializer = new XMLSerializer();
      this.videoWriter = new WebMWriter({
        quality: 0.95,
        frameRate: 60
      });
    }

    if (validation.isSVG(el)) {
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
    } else if (validation.isCanvas(el)) {
      this.videoWriter.addFrame(el);
    }
    else {
      // This is slow. We should find a more efficient way
      const frame = await htmlToCanvas(el);
      this.videoWriter.addFrame(frame);
    }
  }

  /**
   * Finish a static or animated design function
   * @param {SVGElement|HTMLCanvasElement|HTMLElement} el - Element with the current drawing state of the design function
   * @param {Object} extras  - object containing extra elements needed by some engines
   */
  async done(el, extras = {}) {
    if (!this.settings.animated) {
      if (validation.isSVG(el)) {
        el = svgAppendStyles(el, extras.head);

        this.serializer = new XMLSerializer();

        let svgString = svgPrepare(el, this.serializer);

        if (this.settings.optimize !== false) {
          svgString = svgOptimize(svgString, this.settings.optimize);
        }
        this.svgData = svgToDataUrl(svgString);
      } else if (validation.isCanvas(el)) {
        this.canvasData = el.toDataURL();
      } else {
        this.htmlData = await htmlToDataUrl(el);
      }
    } else {
      if (!validation.supportsFormatWebP()) {
        throw new MechanicError(
          "Your running browser doesn't support WebP generation. Try using Chrome for exporting."
        );
      }
      if (validation.isSVG(el)) {
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
}