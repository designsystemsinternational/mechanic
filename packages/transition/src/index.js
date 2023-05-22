import { resolveEasing, EasingFunctions } from "./easings.js";
import { resolveDirection, DirectionFunctions } from "./direction.js";

const defaultOptions = {
  from: 0,
  to: 0,
  duration: 0,
  delay: 0,
  easing: "linear",
  iterationCount: 1,
  direction: "forward"
};

/**
 * Validates the iteration supplied by the user to be a positive
 * integer value.
 *
 * @params{any} iteration
 * @returns number
 */
const validateIterationCount = iteration => {
  if (
    typeof iteration !== "number" ||
    iteration < 0 ||
    (!Number.isInteger(iteration) && Number.isFinite(iteration))
  ) {
    throw new Error(
      `iterationCount expects a positive integer. Got ${iteration}.`
    );
  }

  return iteration;
};

/**
 * Factory function building a pre-loaded transition that can be
 * ticked on every frame.
 *
 * @params{object} options
 */
export const transition = (_options = {}) => {
  const options = Object.assign({}, defaultOptions, _options);
  const easingFn = resolveEasing(options.easing);
  const directionFn = resolveDirection(options.direction);
  const iterationCount = validateIterationCount(options.iterationCount);
  const { from, to, duration, delay } = options;
  const change = to - from;

  return tick => {
    const currentTime = Math.max(0, tick - delay);
 
    // Scaling by 1000 turns any input made in seconds into milliseconds
    // and makes sure we can safely divide numbers
    const t = directionFn(currentTime * 1000, duration * 1000, iterationCount);

    return change * easingFn(t) + from;
  };
};

export const namedEasings = Object.keys(EasingFunctions);
export const namedDirections = Object.keys(DirectionFunctions);
