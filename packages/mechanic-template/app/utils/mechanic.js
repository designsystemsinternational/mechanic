import { download } from "./download";
import WebMWriter from "./webm-writer";
import seedrandom from "seedrandom";

// These utils should probably be moved to a mechanic-utils package
const isObject = obj => obj && typeof obj === "object";
const hasKey = (obj, key) => obj.hasOwnProperty(key);
const supportedTypes = ["string", "integer", "boolean"];

/**
 * Receives the parameter template and checks that it is valid
 * @param {object} params - Parameter template from the design function
 */
const validateParams = params => {
  if (!isObject(params.size)) {
    return `Parameter template must have a size object`;
  }
  const { size, ...optionals } = params;
  if (!isObject(size.default)) {
    return `Parameter template must have default size`;
  }
  for (let param in optionals) {
    if (!hasKey(optionals[param], "type")) {
      return `Parameter ${param} must have ${key} property`;
    }
    if (!supportedTypes.includes(optionals[param].type)) {
      return `Parameter of type ${optionals[param].type} not supported, expected: ${supportedTypes}`;
    }
    if (!hasKey(optionals[param], "default")) {
      return `Parameter ${param} must have ${key} property`;
    }
  }
  return null;
};

/**
 * Receives the parameters and values and validates that the values
 * are valid according to the template.
 * @param {object} params - Parameter template from the design function
 * @param {object} values - Values for some or all of the parameters
 */
const validateValues = (params, values = {}) => {
  // Validate that the size is specified in the template
  if (hasKey(values, "size") && !hasKey(params.size, values.size)) {
    return `Supplied size parameter is not available in the template: ${values.size}`;
  }

  // TODO: Check that there are not other values besides parameters and default params

  return null;
};

/**
 * Receives the settings from a function and validates it.
 * @param {object} settings - Design function settings
 */
const validateSettings = settings => {
  if (!hasKey(settings, "engine")) {
    return `The design function must have specify an engine in settings`;
  }
  return null;
};

/**
 * Receives the parameters and values and returns an object with parameter
 * values (including defaults if value is missing) that can be passed to the
 * design function.
 * @param {object} params - Parameter template from the design function
 * @param {object} settings - Settings from the design function
 * @param {object} values - Values for some or all of the parameters
 */
const prepareValues = (params, settings, values) => {
  // Size
  const size = values.size || "default";
  const vals = Object.assign({}, values, {
    width: params.size[size].width,
    height: params.size[size].height
  });

  // Scale down to fit
  if (values.scaleDownToFit) {
    const ratioWidth = values.scaleDownToFit.width ? values.scaleDownToFit.width / vals.width : 1;
    const ratioHeight = values.scaleDownToFit.height
      ? values.scaleDownToFit.height / vals.height
      : 1;
    if (ratioWidth < 1 || ratioHeight < 1) {
      const ratio = ratioWidth < ratioHeight ? ratioWidth : ratioHeight;
      vals.width = Math.floor(vals.width * ratio);
      vals.height = Math.floor(vals.height * ratio);
    }
  }

  // Random seed
  if (settings.usesRandom) {
    if (!vals.randomSeed) {
      vals.randomSeed = seedrandom(null, { global: true });
    }
    seedrandom(vals.randomSeed, { global: true });
  }

  // Other params

  Object.keys(params).forEach(key => {
    if (key != "size") {
      let val = values[key] === undefined ? params[key].default : values[key];
      if (params[key].type == "integer") {
        vals[key] = parseInt(val);
      } else {
        vals[key] = val;
      }
    }
  });

  return vals;
};

/**
 * Validates that a DOM element is SVG or Canvas
 * @param {object} el - A DOM element to check
 */
const validateEl = el => {
  if (el instanceof SVGElement || el instanceof HTMLCanvasElement) {
    return null;
  }
  return "Element passed to the frame() function must be SVGElement or HTMLCanvasElement";
};

/**
 * Checks whether a DOM element is instance of SVGElement
 * @param {object} el - A DOM element to check
 */
const isSVG = el => el instanceof SVGElement;

/**
 * Converts an SVG element to a data url
 * @param {SVGElement} el - SVG element to convert
 * @param {XMLSerializer} serializer - An instance of XMLSerializer to use for serialization
 */
const svgToDataUrl = (el, serializer) => {
  let str = serializer.serializeToString(el);
  if (!str.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    str = str.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!str.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
    str = str.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }
  str = '<?xml version="1.0" standalone="no"?>\r\n' + str;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(str);
};

/**
 * Draws a dataUrl to canvas
 * @param {string} dataUrl - SVG string to draw
 * @param {HTMLCanvasElement} canvas - A canvas element to draw into
 */
const dataUrlToCanvas = (dataUrl, canvas) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);
      resolve();
    };
    image.onerror = e => {
      reject(e);
    };
    image.src = dataUrl;
  });

/**
 * A class to run Mechanic design functions
 */
export class Mechanic {
  /**
   * Mechanic class constructor
   * @param {object} params - Parameters from the design function
   * @param {object} settings - Settings from the design function
   * @param {object} values - Values for some or all of the design function parameters
   */
  constructor(params, settings, values) {
    const err1 = validateParams(params);
    if (err1) {
      throw err1;
    }

    const err2 = validateSettings(settings);
    if (err2) {
      throw err2;
    }

    const err3 = validateValues(params, values);
    if (err3) {
      throw err3;
    }

    this.params = params;
    this.settings = settings;
    this.values = prepareValues(params, settings, values);
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
   */
  frame(el) {
    if (!this.settings.animated) {
      throw "The frame() function can only be used for animations";
    }

    const err = validateEl(el);
    if (err) {
      throw err;
    }

    // Init values if needed. Is it slow to do this on the first frame?
    // We put it here because constructor would create objects not needed for preview
    if (!this.exportInit) {
      this.exportInit = true;
      this.serializer = new XMLSerializer();
      if (this.settings.animated) {
        this.videoWriter = new WebMWriter({
          quality: 0.95,
          frameRate: 60
        });
      }
    }

    if (isSVG(el)) {
      // Because drawing an SVG to canvas is asynchronous,
      // We wait until the end to render it all.
      // TODO: This needs to be revisited.
      if (!this.svgFrames) {
        this.svgFrames = [];
      }
      this.svgFrames.push(svgToDataUrl(el, this.serializer));
    } else {
      this.videoWriter.addFrame(el);
    }
  }

  /**
   * Finish a static or animated design function
   * @param {SVGElement|HTMLCanvasElement} el - Element with the current drawing state of the design function
   */
  async done(el) {
    if (!this.settings.animated) {
      if (isSVG(el)) {
        // This conditional is a patch to an error, needs to be revised:
        if (!this.serializer) {
          this.serializer = new XMLSerializer();
        }
        this.svgData = svgToDataUrl(el, this.serializer);
      } else {
        this.canvasData = el.toDataURL();
      }
    } else {
      if (isSVG(el)) {
        // This is slow. We should figure out a way to draw into canvas on every frame
        // or at least do Promise.all
        const cacheCanvas = document.createElement("canvas");
        cacheCanvas.width = this.values.width;
        cacheCanvas.height = this.values.height;
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
   * Download the output of a design function
   * @param {string} fileName - Name of file to be downloaded. Will automatically receive filetype.
   */
  download(fileName) {
    if (!this.isDone) {
      throw "The download function can only be called after the done() function has finished";
    }
    if (this.svgData) {
      download(this.svgData, `${fileName}.svg`, "image/svg+xml");
    } else if (this.canvasData) {
      download(this.canvasData, `${fileName}.png`, "image/png");
    } else if (this.videoData) {
      download(this.videoData, `${fileName}.webm`, "video/webm");
    }
  }
}
