import { optimize, extendDefaultPlugins } from "svgo/dist/svgo.browser.js";
import { toPng, toCanvas } from "html-to-image";

/**
 * Checks whether a DOM element is instance of SVGElement
 * @param {object} el - A DOM element to check
 */
const isSVG = el => el instanceof SVGElement;

/**
 * Checks whether a DOM element is instance of HTMLCanvasElement
 * @param {object} el - A DOM element to check
 */
const isCanvas = el => el instanceof HTMLCanvasElement;

/**
 * Validates that a DOM element is SVG or Canvas
 * @param {object} el - A DOM element to check
 */
const validateEl = el => {
  if (isSVG(el) || el instanceof HTMLElement) {
    return null;
  }
  return "Element passed to the frame() function must be SVGElement or HTMLElement";
};

/**
 * Validates that running browser supports webp generations.
 * Extracted from: https://stackoverflow.com/questions/5573096/detecting-webp-support
 */
function supportsFormatWebP() {
  const elem = document.createElement("canvas");

  if (!!(elem.getContext && elem.getContext("2d"))) {
    // was able or not to get WebP representation
    return elem.toDataURL("image/webp").indexOf("data:image/webp") == 0;
  } else {
    // very old browser like IE 8, canvas not supported
    return false;
  }
}

/**
 * Appends linked styles to an SVG, returns a copy of the element
 * @param {SVGElement} el - SVG element to convert
 * @param {HTMLElement} head - Head element to copy styles from
 */
const svgAppendStyles = (el, head) => {
  let copy = el;

  if (head) {
    copy = el.cloneNode(true);
    const styles = head.querySelectorAll("style");
    for (var i = 0; i < styles.length; i++) {
      copy.append(styles[i].cloneNode(true));
    }
  }
  return copy;
};

/**
 * Prepares an SVG element with sensible defaults and returns serialized svg string
 * @param {SVGElement} el - SVG element to convert
 * @param {XMLSerializer} serializer - An instance of XMLSerializer to use for serialization
 */
const svgPrepare = (el, serializer) => {
  let str = serializer.serializeToString(el);

  if (!str.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    str = str.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  if (!str.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
    str = str.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }
  str = '<?xml version="1.0" standalone="no"?>\r\n' + str;
  return str;
};

/**
 * Optimizes an SVG with SVGO
 * @param {String} svgString - SVG string to optimize
 */
const svgOptimize = (svgString, optimizeOptions) => {
  const options = Object.assign({}, optimizeOptions);

  if (options.plugins) options.plugins = extendDefaultPlugins(options.plugins);

  const result = optimize(svgString, options);

  return result.data;
};

/**
 * Converts an SVG string to a data url
 * @param {String} svg - SVG string to convert
 */
const svgToDataUrl = str => {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(str);
};

/**
 * Converts a HTML node to a data url
 * @param {Node} node - SVG string to convert
 */
const htmlToDataUrl = async node => {
  return new Promise((resolve, reject) => {
    toPng(node).then(resolve).catch(reject);
  });
};

/**
 * Converts a HTML node to a canvas
 * @param {Node} node - SVG string to convert
 */
const htmlToCanvas = async node => {
  return new Promise((resolve, reject) => {
    toCanvas(node).then(resolve).catch(reject);
  });
};

/**
 * Extracts size of an SVG element
 * @param {SVGElement} el - SVG element
 */
const extractSvgSize = el => {
  return { height: el.height.baseVal.value, width: el.width.baseVal.value };
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
 * Returns a timestamp to be used in a filename
 */
const getTimeStamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  const hour = `${now.getHours()}`.padStart(2, "0");
  const minute = `${now.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}-${hour}-${minute}`;
};

export {
  isSVG,
  isCanvas,
  validateEl,
  supportsFormatWebP,
  svgAppendStyles,
  svgPrepare,
  svgOptimize,
  svgToDataUrl,
  htmlToDataUrl,
  htmlToCanvas,
  extractSvgSize,
  dataUrlToCanvas,
  getTimeStamp
};
