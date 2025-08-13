/**
 * Throws if a predicate isn't true
 *
 * @param {boolean} predicate
 * @param {string} msg
 */
export const assert = (pred, msg) => {
  if (!pred) throw new Error(msg);
};

/**
 * Utility to make handling errors passed from
 * puppeteer a bit easier.
 *
 * @param {string} msg
 * @param {Array<any>} ...rest
 */
export const panic = (msg, ...args) => {
  throw new Error(`${msg}\n\n${args}`);
};
