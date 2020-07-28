import { download } from "./download";
import WebMWriter from "./webm-writer";

// These utils should probably be moved to a mechanic-utils package
const isObject = obj => obj && typeof obj === "object";
const hasKey = (obj, key) => obj.hasOwnProperty(key);

/**
 * Receives the parameter template and checks that it is valid
 * @param {object} params - Parameter template from the design function
 */
const validateParams = params => {
  if (!isObject(params.size)) {
    return `Parameter template must have a size object`;
  }
  if (!isObject(params.size.default)) {
    return `Parameter template must have default size`;
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
  return null;
};

/**
 * Receives the settings from a function and validates it.
 * @param {object} settings - Design function settings
 */
const validateSettings = settings => {
  // Validate that it has a type
  if (!hasKey(settings, "type")) {
    return `The design function must have a type in its settings export`;
  }
  if (!["image", "video"].includes(settings.type)) {
    return `Wrong type in design function settings: ${settings.type}`;
  }
  if (!hasKey(settings, "returns")) {
    return `The design function must have a returns in its settings export`;
  }
  if (!["svgString", "canvas", "svg"].includes(settings.returns)) {
    return `Wrong returns in design function settings: ${settings.returns}`;
  }
  return null;
};

/**
 * Receives the parameters and values and returns an object with parameter
 * values (including defaults if value is missing) that can be passed to the
 * design function.
 * @param {object} params - Parameter template from the design function
 * @param {object} values - Values for some or all of the parameters
 */
const getParameterValues = (params, values = {}) => {
  const size = values.size || "default";
  let width = params.size[size].width;
  let height = params.size[size].height;
  if (
    values.scaleDownToFit &&
    (values.scaleDownToFit.width < width || values.scaleDownToFit.height < height)
  ) {
    const ratioWidth = values.scaleDownToFit.width ? values.scaleDownToFit.width / width : 1;
    const ratioHeight = values.scaleDownToFit.height ? values.scaleDownToFit.height / height : 1;
    const ratio = ratioWidth < ratioHeight ? ratioWidth : ratioHeight;
    width = Math.floor(width * ratio);
    height = Math.floor(height * ratio);
  }
  return { size, width, height };
};

/**
 * A class to run Mechanic design functions
 * @param {object} handler - The design function
 * @param {object} params - Parameter template from the design function
 * @param {object} values - Values for some or all of the parameters
 * @param {object} settings - Settings for the design function
 * @param {object} opts - Options for the design function
 */
export class Mechanic {
  constructor(handler, params, settings, values = {}, opts = {}) {
    const err1 = validateParams(params);
    if (err1) {
      throw err1;
    }

    const err2 = validateValues(params, values);
    if (err2) {
      throw err2;
    }

    const err3 = validateSettings(settings);
    if (err3) {
      throw err3;
    }

    this.handler = handler;
    this.finalParams = getParameterValues(params, values);
    this.settings = settings;
    this.values = values;
    this.opts = opts;

    this.listeners = {};
    this.dispatches = {};

    if (settings.type === "video" && !opts.preview) {
      this.videoWriter = new WebMWriter({
        quality: 0.95,
        frameRate: 60
      });
    }

    if (settings.type === "video" && settings.returns === "svgString") {
      this.svgCanvas = document.createElement("canvas");
      this.svgCanvas.width = finalParams.width;
      this.svgCanvas.height = finalParams.height;
    }

    this.init = this.init.bind(this);
    this.frame = this.frame.bind(this);
    this.done = this.done.bind(this);
  }

  run() {
    this.handler(this.finalParams, {
      init: this.init,
      frame: this.frame,
      done: this.done,
      // A raf implementation that bypasses on export
      requestAnimationFrame: this.opts.preview
        ? window.requestAnimationFrame.bind(window)
        : func => func()
    });
  }

  // Handler callbacks
  // ----------------------------------------------------

  init(el) {
    this.dispatch("init", [el, this.finalParams]);
  }

  frame(el) {
    if (this.settings.type === "image") {
      throw "The frame() function can only be used for videos";
    }

    if (this.settings.returns === "svgString") {
      el = stringToSVG(el);
    }

    if (this.videoWriter) {
      // Convert to canvas if needed here!
      this.videoWriter.addFrame(el);
    }

    if (!this.hasDispatched("init")) {
      this.dispatch("init", [el, this.finalParams]);
    }
    this.dispatch("frame", [el, this.finalParams]);
  }

  done(el) {
    if (typeof el === "string") {
      el = stringToSVG(el);
      this.doneSVG = el;
    } else if (this.videoWriter) {
      this.doneVideoWriter = this.videoWriter.complete();
    } else if (el instanceof HTMLCanvasElement) {
      this.doneCanvas = el;
    }

    if (!this.hasDispatched("init")) {
      this.dispatch("init", [el, this.finalParams]);
    }
    this.dispatch("done", [el, this.finalParams]);
  }

  // Download
  // ----------------------------------------------------

  download(fileName) {
    if (this.hasDispatched("done")) {
      if (this.doneSVG) {
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(this.doneSVG);
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
          source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
          source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
        const link = document.createElement("a");
        link.download = `${fileName}.svg`;
        link.href = url;
        link.click();
      } else if (this.doneCanvas) {
        const link = document.createElement("a");
        link.download = `${fileName}.png`;
        link.href = this.doneCanvas.toDataURL();
        link.click();
      } else if (this.doneVideoWriter) {
        this.doneVideoWriter.then(blob => {
          download(blob, `${fileName}.webm`);
        });
      }
    } else {
      throw "The download() function can only be called after the done event";
    }
  }

  // Events
  // ----------------------------------------------------

  addEventListener(eventName, func) {
    if (!this.listeners.hasOwnProperty(eventName)) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(func);
  }

  removeEventListener(eventName, func) {
    if (!this.listeners.hasOwnProperty(eventName)) {
      return;
    }
    const idx = this.listeners[eventName].findIndex(f => f === func);
    if (idx > -1) {
      this.listeners[eventName].splice(idx, 1);
    }
  }

  dispatch(eventName, eventData) {
    if (!this.dispatches.hasOwnProperty(eventName)) {
      this.dispatches[eventName] = 0;
    }
    this.dispatches[eventName]++;
    if (!this.listeners.hasOwnProperty(eventName)) {
      return;
    }
    for (let listener of this.listeners[eventName]) {
      listener.apply(this, eventData);
    }
  }

  hasDispatched(eventName) {
    return this.dispatches[eventName] > 0;
  }
}

// Helpers

const stringToSVG = svgString => {
  const div = document.createElement("div");
  div.innerHTML = svgString;
  return div.childNodes[0];
};
