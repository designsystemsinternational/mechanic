import { load } from "opentype.js";

export const loadOpentypeFont = (name, callback) => {
  const fontUrl = `/static/${name}`;
  if (callback) {
    load(fontUrl, (err, font) => {
      if (err) {
        throw err;
      } else {
        callback(font);
      }
    });
  } else {
    return load(fontUrl);
  }
};
