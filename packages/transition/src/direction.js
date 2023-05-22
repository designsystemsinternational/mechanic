/**
 * Pre-configured collection of direction functions. A direction function
 * gets the current timestamp and the duration of the transition as
 * its input and repeats a noramlized t value between 0 and 1.
 */
export const DirectionFunctions = {
  // Runs the transition once forward
  forward: (current, duration, iterationCount) => {
    const curIteration = Math.floor(current / duration);
    if (curIteration >= iterationCount) return 1;

    return (current % duration) / duration;
  },

  // Alternates the transition between forwards and
  // backwards execution
  alternate: (current, duration, iterationCount) => {
    const curIteration = Math.floor(current / duration);
    const t = (current % duration) / duration;

    if (curIteration >= iterationCount) {
      return iterationCount % 2 === 0 ? 0 : 1;
    } else {
      return curIteration % 2 === 0 ? t : 1 - t;
    }
  },

  // Reverses the transition
  reverse: (current, duration, iterationCount) => {
    const curIteration = Math.floor(current / duration);
    if (curIteration >= iterationCount) return 0;
    return 1 - (current % duration) / duration;
  },

  // Alternates the transition, starting from the
  // reversed transition
  alternateReverse: (current, duration, iterationCount) => {
    const curIteration = Math.floor(current / duration);
    const t = (current % duration) / duration;

    if (curIteration >= iterationCount) {
      return iterationCount % 2 === 0 ? 1 : 0;
    } else {
      return curIteration % 2 === 0 ? 1 - t : t;
    }
  }
};

/**
 * Looks up the user specified animation direction and returns
 * the matching function.
 *
 * @params{string} direction
 */
export const resolveDirection = direction => {
  if (DirectionFunctions[direction]) return DirectionFunctions[direction];

  throw new Error(
    `Unexpected direction (${direction}) passed to transition function. Direction should be one of the pre-built values: ${Object.keys(
      DirectionFunctions
    ).join(", ")}.`
  );
};
