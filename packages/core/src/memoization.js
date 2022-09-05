import { hashFromString } from "./mechanic-utils.js";

const mechanicMemoizationPool = {};

/**
 * Memoizes the return value of a function. To be used when the result of a
 * heavy computation or the loading of a bigger file should be cached across
 * function runs.
 *
 * It uses the function as well as the arguments to compute a cache key. This
 * way it can be used multiple times within a user's function.
 *
 * @param{function} fn - Function to memoize
 * @param{array} args - Arguments to pass to the function
 * @return{any} - Result of the function
 *
 * @example
 * mechanicPreload(() => a + b, [a, b]);
 */

export const memo = (fn, args) => {
  const key = hashFromString(`${fn.toString()}${JSON.stringify(args)}`);
  if (mechanicMemoizationPool[key]) {
    return mechanicMemoizationPool[key];
  }
  const result = fn();
  mechanicMemoizationPool[key] = result;
  return result;
};
