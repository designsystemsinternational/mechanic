import { MechanicError } from "./mechanic-error.js";

/**
 * Sets up iframe's window functions that call
 * the corresponding engines and design functions from context function.
 * @param {object} functions - object that holds all user defined
 * design functions export objects.
 */
const setUp = designFunction => {
  const engine = designFunction.settings?.engine?.run;
  // window.run = () => {
  //   alert(
  //     "The engine and/or function may still be loading, try again in a bit. If this keeps happening, post an issue!"
  //   );
  // };
  // window.initEngine = functionName => {
  //   if (engines[functionName] === undefined) {
  //     window.run = () => {
  //       const p = document.createElement("p");
  //       p.textContent = `No engine to run for ${functionName}!`;
  //       document.body.appendChild(p);
  //     };
  //     throw new MechanicError(`No defined engine for: ${functionName}`);
  //   } else if (engines[functionName] !== curEngine) {
  //     console.info("Setting mechanic engine for:", functionName);
  //     curEngine = engines[functionName];
  //     window.run = (functionName, values, isPreview) => {
  //       // TODO: Do performance stats here?
  //       const func = functions[functionName];
  //       try {
  //         const mechanic = curEngine(functionName, func, values, isPreview);
  //         return mechanic ? mechanic : null;
  //       } catch (error) {
  //         alert("There was an error running the engine and/or function. Check the console!");
  //         throw error;
  //       }
  //     };
  //   }
  // };
  window.run = (functionName, values, isPreview) => {
    // TODO: Do performance stats here?
    const func = designFunction;
    try {
      const mechanic = engine(functionName, func, values, isPreview);
      return mechanic ? mechanic : null;
    } catch (error) {
      alert("There was an error running the engine and/or function. Check the console!");
      throw error;
    }
  };
  console.info("Design function definitions set.");
};

export { setUp };
