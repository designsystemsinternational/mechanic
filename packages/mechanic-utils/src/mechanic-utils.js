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

export { svgToDataUrl, extractSvgSize, dataUrlToCanvas, getTimeStamp };
