import path from "path";

/**
 * Generate a UUID to use in component ID attributes
 * @param {string} prefix - Optional string prefix for the UUID
 */
export const uid = (prefix = "comp") =>
  prefix + "-" + Math.random().toString(36).substring(2, 16);

/**
 * Uses webpack's require.context to require all index.js files
 * inside the `functions` folder.
 */
export const requireFunctions = () => {
  const functions = {};
  const context = require.context("../../functions", true, /index\.js/);
  context.keys().forEach(k => {
    const key = path.dirname(k).split(path.sep).pop();
    functions[key] = context(k);
  });
  return functions;
};
