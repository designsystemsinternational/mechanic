import { MechanicError } from "./mechanic-error.js";

/**
 * Sets up iframe's window function that call
 * the corresponding engine and design function.
 * @param {object} designFunction - Object exported by user that holds the design function's definition.
 */
const setUp = designFunction => {
  const engine = designFunction.settings?.engine?.run;
  if (engine === undefined) {
    window.run = functionName => {
      alert(
        "Design function is either missing a settings export or doesn't define a proper engine."
      );
      throw new MechanicError(`Invalid engine for design function: ${functionName}`);
    };
    console.error("Couldn't load design function's engine.");
    return;
  }

  window.run = (functionName, values, isPreview) => {
    // TODO: Do performance stats here?
    try {
      const mechanic = engine(functionName, designFunction, values, isPreview);
      return mechanic ? mechanic : null;
    } catch (error) {
      alert("There was an error running the engine and/or function. Check the console!");
      throw error;
    }
  };
  console.info("Design function definition set.");
};

export { setUp };
