/**
 * Turns the result returned by headless mechanic into
 * a buffer (either of text or binary data) that can be
 * processed further server-side (e.g. send as a HTTP response
 * or written to file)
 *
 * @param {any} data
 * @param {string} mimeType
 * @returns {Buffer}
 */
export const createBufferFromRender = (data, mimeType) => {
  let buffer; 

  switch (mimeType) {
    case "image/png": {
      buffer = Buffer.from(data.split(",").pop(), "base64");
      break;
    }
    case "video/webm": {
      buffer = Buffer.from(data, "binary");
      break;
    }
    case "image/svg+xml": {
      buffer = decodeURIComponent(data.split("charset=utf-8,").pop());
      break;
    }
    default: {
      throw new Error(`Unknown mime type (${mimeType}).`);
    }
  }

  return buffer;
}
