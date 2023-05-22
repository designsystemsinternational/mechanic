/**
 * Pre-configured collection of repeat functions. A repeat function
 * gets the current timestamp and the duration of the transition as
 * its input and repeats a noramlized t value between 0 and 1.
 */
export const RepeatFunctions = {
  // Runs the transition once forward
  once: (current, duration) => {
    if (current >= duration) return 1;
    return current / duration;
  },

  // Repeats the transition indefinitely
  repeat: (current, duration) => current % duration,

  // Alternates the transition between forwards and
  // backwards execution
  alternate: (current, duration) => {
    const offset = Math.floor(current / duration);
    const t = current % duration;

    return offset % 2 === 0 ? t : 1 - t;
  },

  // Reverses the transition
  reverse: (current, duration) => {
    if (current >= duration) return 0;
    return 1 - current / duration;
  },

  // Repeats the transition in reverse
  repeatReverse: (current, duration) => 1 - (current % duration),

  // Alternates the transition, starting from the
  // reversed transition
  alternateReverse: (current, duration) => {
    const offset = Math.floor(current / duration);
    const t = current % duration;

    return offset % 2 === 0 ? 1 - t : t;
  }
};

/**
 * Turns the user specified easing into a function that can
 * be executed by the transition utility.
 *
 * Easing can either be a string referencing one of the
 * pre-built easing functions or a custom function.
 *
 * @params{string|function} repeat
 */
export const resolveRepeat = repeat => {
  // If the user specified a function for the repeat,
  // we’re using that
  if (typeof repeat === "function") return easing;

  // If not, we check if we can return a pre-built
  // easing function
  if (RepeatFunctions[repeat]) return RepeatFunctions[repeat];

  // Lastly we need to throw
  throw new Error(
    `Unexpected repeat (${easing}) passed to transition function. Repat should either be a custom function or one of the pre-built values: ${Object.keys(
      RepeatFunctions
    ).join(", ")}.`
  );
};


