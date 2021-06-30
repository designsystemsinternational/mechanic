import { MechanicError } from "./mechanic-error";

/**
 * Sets up iframe's window functions that call
 * the corresponding engines and design functions from context function.
 * @param {object} functions - object that holds all user defined
 * design functions export objects.
 */
const setUp = functions => {
  console.info("Setting up design functions!");
  const engines = {};
  Object.keys(functions).forEach(
    functionName => (engines[functionName] = functions[functionName].settings.engine)
  );
  let curEngine = null;
  window.initEngine = functionName => {
    if (engines[functionName] === undefined) {
      window.run = () => {
        const p = document.createElement("p");
        p.textContent = `No engine to run for ${functionName}!`;
        document.body.appendChild(p);
      };
      throw new MechanicError(`No defined engine for: ${functionName}`);
    } else if (engines[functionName] !== curEngine) {
      console.info("Setting mechanic engine for:", functionName);
      // TODO: Kill existing sketch if running?
      curEngine = engines[functionName];
      window.run = (functionName, values, isPreview) => {
        // TODO: Do performance stats here?
        const func = functions[functionName];
        const mechanic = curEngine(functionName, func, values, isPreview);
        return mechanic ? mechanic : null;
      };
    }
  };
};

export { setUp };
