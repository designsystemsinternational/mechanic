import { resolveEasing, EasingFunctions } from "./easings.js";
import { resolveRepeat, RepeatFunctions } from "./repeat.js";

const defaultOptions = {
  from: 0,
  to: 0,
  duration: 0,
  delay: 0,
  easing: "linear",
  repeat: "once"
};

/**
 * Factory function building a pre-loaded transition that can be
 * ticked on every frame.
 *
 * @params{object} options
 */
export const transition = (_options = {}) => {
  const options = Object.assign({}, defaultOptions, _options);
  const easing = resolveEasing(options.easing);
  const repeat = resolveRepeat(options.repeat);
  const { from, to, duration, delay } = options;
  const change = to - from;

  return tick => {
    const currentTime = Math.max(0, tick - delay);
    const t = repeat(currentTime, duration);

    return change * easing(t) + from;
  };
};

export const namedEasings = Object.keys(EasingFunctions);
export const namedRepeats = Object.keys(RepeatFunctions);
