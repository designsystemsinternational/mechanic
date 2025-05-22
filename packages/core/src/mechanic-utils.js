import { optimize, extendDefaultPlugins } from "svgo/dist/svgo.browser.js";
import { toPng, toCanvas } from "html-to-image";
import { parse as parseCSS, generate as generateCSS } from "css-tree";
import { selectOne as cssSelectOne } from "css-select";
import cssSelectBrowserAdapter from "css-select-browser-adapter";
import deepmerge from "deepmerge";

import { DEFAULT_SETTINGS } from "./default-settings.js";

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
    // Get all style to export
    const styles = head.querySelectorAll("style");

    // Incrementally built styles to export
    let filteredStyles = "";

    for (var i = 0; i < styles.length; i++) {
      // Parse CSS
      const styleNode = styles[i];
      const styleSheetTree = parseCSS(styleNode.innerHTML);

      // Go through direct stylesheet children declarations
      let childNode = styleSheetTree.children.head;
      while (childNode != null) {
        // Filtering out rules with no matches
        if (childNode.data.type === "Rule") {
          // Check if rules selector actually match so something in export
          const { prelude } = childNode.data;
          const selector = generateCSS(prelude);
          let results;
          try {
            results = cssSelectOne(selector, el.parentElement, {
              adapter: cssSelectBrowserAdapter
            });
          } catch (e) {
            // Some known errors:
            // Pseudo-elements are not supported by css-select
            // unmatched pseudo-class
          }
          // If they do match to something, export rule
          if (results != null) {
            const ruleCSS = generateCSS(childNode.data);
            filteredStyles += ruleCSS;
          }
        } else {
          // Other nodes that aren't rules copy directly
          const elementCSS = generateCSS(childNode.data);
          filteredStyles += elementCSS;
        }

        // Next node
        childNode = childNode.next;
      }
    }

    // Add style node with exported styles
    const filteredStyleNode = document.createElement("style");
    filteredStyleNode.innerHTML = filteredStyles;
    copy.append(filteredStyleNode.cloneNode(true));
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
    str = str.replace(
      /^<svg/,
      '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
    );
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

/**
 * Creates a standardized settings object from user-provided settings.
 *
 * @param {object} settings - User-provided settings
 * @returns {object} - Standardized settings object
 */
const mergeWithDefaultSettings = (
  settings,
  defaultSettings = DEFAULT_SETTINGS
) => {
  return deepmerge(defaultSettings, settings);
};

/**
 * Turns an input string into a hash to be used as a cache key.
 * @param {string} str - String to hash
 * @param {number} length - Length of the hash
 * @return {string} - Hashed string
 */
const hashFromString = (str, len = Infinity) => {
  let hash = 0;
  if (str.length == 0) return hash.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString().substring(0, len);
};

/**
 * Clamps a number between a min and max value
 *
 * @param {number} min
 * @param {number} max
 * @param {number} value
 * @returns {number}
 */
const clamp = (min, max, value) => {
  return Math.max(min, Math.min(max, value));
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
  getTimeStamp,
  mergeWithDefaultSettings,
  hashFromString,
  clamp
};
