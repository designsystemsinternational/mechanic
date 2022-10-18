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
  getTimeStamp,
  mergeWithDefaultSettings
} from "./mechanic-utils.js";

import { mechanicDrawLoop } from "./mechanic-drawloop.js";
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
    const {
      lastRun,
      boundingClient,
      scale,
      randomSeed,
      isPreview,
      exportType
    } = config;

    values._isPreview = isPreview;

    const persistRandomOnExport =
      !settings.hasOwnProperty("persistRandomOnExport") ||
      settings.persistRandomOnExport;
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

    this.settings = mergeWithDefaultSettings(settings);
    this.values = values;
    this.functionState = lastRun?.functionState ?? {};
    this.exportType = exportType;

    this.drawLoop = mechanicDrawLoop.prepare(this.settings.frameRate);

    this.engineFrameCallback = () => {};
    this.engineDoneCallback = () => {};
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
   * Convenience function to collect all callbacks that an engine can pass to a
   * design function. An engine can pass overwrites to inject custom behavior
   * into the callbacks. This is currently used by engine-p5 to disable using
   * mechanic.drawLoop within engine-p5.
   *
   * @param {object} overwrites - An object with overwrites for the callbacks
   *
   * @TODO: Could this be merged with the function above?
   */
  callbacksForEngine(overwrites = {}) {
    return Object.assign(
      {},
      {
        frame: (...args) => this.engineFrameCallback(...args),
        done: (...args) => {
          // Always make sure to stop the drawloop when we're done rendering
          this.drawLoop.stop();
          this.engineDoneCallback(...args);
        },

        // This is where the timeline feature could intercept to render a
        // single frame. A single frame number can be passed as the second
        // arguments to drawLoop's start method.
        drawLoop: cb => this.drawLoop.start(cb),

        // Keeping setState and state in their own namespace to avoid namespace
        // collisions with React
        mechanic: {
          setState: this.setState.bind(this),
          state: this.functionState
        }
      },
      overwrites
    );
  }

  /**
   * Helper function that sets the engineFrameCallback to an instance variable.
   * Done as a function so validation and other setter logic can be added later.
   *
   * @param {function} frameCallback - The frame callback function
   */
  registerFrameCallback(frameCallback) {
    this.engineFrameCallback = frameCallback;
  }

  /**
   * Helper function that sets the engineFinalizeCallback to an instance variable.
   * Done as a function so validation and other setter logic can be added later.
   *
   * @param {function} doneCallback - The done callback function
   */
  registerDoneCallback(doneCallback) {
    this.engineDoneCallback = doneCallback;
  }

  /**
   * Register a frame for an animated design function
   * @param {SVGElement|HTMLCanvasElement} el - Element with the current drawing state of the design function
   * @param {Object} extras  - object containing extra elements needed by some engines
   */
  async frame(el, extras = {}) {
    if (!this.settings.animated) {
      throw new MechanicError(
        "The frame() function can only be used for animations"
      );
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
        quality: 0.95,
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

      if (this.settings.ignoreStyles !== true)
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
        if (this.settings.ignoreStyles !== true)
          el = svgAppendStyles(el, extras.head);

        this.serializer = new XMLSerializer();

        let svgString = svgPrepare(el, this.serializer);

        if (this.settings.optimize !== false) {
          svgString = svgOptimize(svgString, this.settings.optimize);
        }
        const data = svgToDataUrl(svgString);
        if (this.exportType === "png") {
          const cacheCanvas = document.createElement("canvas");
          const size = extractSvgSize(el);
          cacheCanvas.width = size.width;
          cacheCanvas.height = size.height;
          await dataUrlToCanvas(data, cacheCanvas);
          this.canvasData = cacheCanvas.toDataURL();
        } else {
          this.svgData = data;
        }
      } else if (isCanvas(el)) {
        if (this.exportType === "svg") {
          throw new MechanicError(
            "Cannot export SVG of Canvas element. Try PNG."
          );
        } else {
          this.canvasData = el.toDataURL();
        }
      } else {
        if (this.exportType === "svg") {
          throw new MechanicError(
            "Mechanic currently doesn't support HTML to SVG conversion. Try PNG."
          );
        } else {
          this.htmlData = await htmlToDataUrl(el);
        }
      }
    } else {
      if (!supportsFormatWebP()) {
        throw new MechanicError(
          "Your running browser doesn't support WebP generation. Try using Chrome for exporting."
        );
      }
      if (!this.frameCalled) {
        throw new MechanicError(
          "Animated export only called done, frame() hasn't been called."
        );
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
      name += "-" + getTimeStamp();
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
      name += "-" + getTimeStamp();
    }
    if (!this.functionState) {
      throw "The downloadState if a state has been set.";
    }
    download(
      JSON.stringify(this.functionState),
      `${name}.json`,
      "application/json"
    );
  }
}
