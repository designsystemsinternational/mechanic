import { EasingFunctions } from "./easings.js";

const defaultOptions = {
  from: 0,
  to: 0,
  duration: 0,
  delay: 0,
  easing: "linear"
};

/**
 * Turns the user specified easing into a function that can
 * be executed by the transition utility.
 *
 * Easing can either be a string referencing one of the
 * pre-built easing functions or a custom function.
 *
 * @params{string|function} easing
 */
const resolveEasing = easing => {
  // If the user specified a function for the easing,
  // we’re using that
  if (typeof easing === "function") return easing;

  // If not, we check if we can return a pre-built
  // easing function
  if (EasingFunctions[easing]) return EasingFunctions[easing];

  // Lastly we need to throw
  throw new Error(
    `Unexpected easing (${easing}) passed to transition function. Easing should either be a custom function or one of the pre-built values: ${Object.keys(
      EasingFunctions
    ).join(", ")}.`
  );
};

export const transition = (_options = {}) => {
  const options = Object.assign({}, defaultOptions, _options);
  const easing = resolveEasing(options.easing);
  const { from, to, duration, delay } = options;
  const change = to - from;

  return tick => {
    const currentTime = Math.max(0, tick - delay);

    if (currentTime >= duration) return to;

    const t = currentTime / duration;

    return change * easing(t) + from;
  };
};

export const namedEasings = Object.keys(EasingFunctions);
