import path from "path";
import { MechanicError } from "./mechanic-error";

/**
 * Uses webpack's require.context to require all index.js files
 * inside `directory`.
 */
const requireFunctions = (context) => {
  const functions = {};
  const engines = {};
  context.keys().forEach((k) => {
    const key = path.dirname(k).split(path.sep).pop();
    functions[key] = context(k);
    const engine = functions[key].settings.engine;
    engines[key] = engine;
  });
  return { functions, engines };
};

/**
 * Looks for any design functions and requires their context and corresponding engines.
 */
const setUp = (functions, engines) => {
  console.log("Setting up!");
  let curEngine = null;
  window.initEngine = (functionName) => {
    if (engines[functionName] === undefined) {
      window.run = () => {
        throw new MechanicError("No engine to run!");
      };
      throw new MechanicError(`No defined engine for: ${functionName}`);
    } else if (engines[functionName] !== curEngine) {
      console.log("Setting engine for:", functionName);
      // TODO: Kill existing sketch if running?
      curEngine = engines[functionName];
      window.run = (functionName, values, isPreview) => {
        // TODO: Do performance stats here?
        const func = functions[functionName];
        curEngine(functionName, func, values, isPreview);
      };
    }
  };
};

export { requireFunctions, setUp };
