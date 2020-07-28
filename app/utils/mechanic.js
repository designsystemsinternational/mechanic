import { download } from "./download";
import WebMWriter from "./webm-writer";

// These utils should probably be moved to a mechanic-utils package
const isObject = obj => obj && typeof obj === "object";
const hasKey = (obj, key) => obj.hasOwnProperty(key);

/**
 * Returns a timestamp to be used in a filename
 */
export const getTimeStamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  const hour = `${now.getHours()}`.padStart(2, "0");
  const minute = `${now.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}-${hour}-${minute}`;
};

/**
 * Receives the parameter template and checks that it is valid
 * @param {object} params - Parameter template from the design function
 */
export const validateParams = params => {
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
export const validateValues = (params, values = {}) => {
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
export const validateSettings = settings => {
  // Validate that it has a type
  if (!hasKey(settings, "type")) {
    return `The design function must have a type in its settings export`;
  }
  if (!["image", "video"].includes(settings.type)) {
    return `Wrong type in design function settings: ${settings.type}`;
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
export const getParameterValues = (params, values = {}) => {
  const size = values.size || "default";
  return {
    size,
    width: params.size[size].width,
    height: params.size[size].height
  };
};

/**
 * Creates a runner for a design function
 * @param {object} handler - The design function
 * @param {object} params - Parameter template from the design function
 * @param {object} values - Values for some or all of the parameters
 * @param {object} settings - Settings for the design function
 * @param {object} opts - Options for the design function
 */
export const createRunner = (
  handler,
  params,
  settings,
  values = {},
  opts = {}
) => {
  const finalParams = getParameterValues(params, values);
  return new Runner(handler, finalParams, settings, opts);
};

/**
 * Creates an event dispatcher
 */
class Runner {
  constructor(handler, finalParams, settings, opts) {
    this.listeners = {};
    this.dispatches = {};
    this.handler = handler;
    this.finalParams = finalParams;
    this.settings = settings;
    this.opts = opts;

    if (settings.type === "video" && !opts.preview) {
      this.videoWriter = new WebMWriter({
        quality: 0.95,
        frameRate: 60
      });
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

    if (this.videoWriter) {
      this.videoWriter.addFrame(el);
    }

    if (!this.hasDispatched("init")) {
      this.dispatch("init", [el, this.finalParams]);
    }
    this.dispatch("frame", [el, this.finalParams]);
  }

  done(el) {
    if (typeof el === "string") {
      const div = document.createElement("div");
      div.innerHTML = el;
      el = div.childNodes[0];
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
        if (
          !source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)
        ) {
          source = source.replace(
            /^<svg/,
            '<svg xmlns="http://www.w3.org/2000/svg"'
          );
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
          source = source.replace(
            /^<svg/,
            '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
          );
        }
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        const url =
          "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
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
