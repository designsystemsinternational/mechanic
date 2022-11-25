import { Mechanic } from "@mechanic-design/core";

const root = document.getElementById("root");
const head = document.querySelector("head");

export const run = (functionName, func, values, config) => {
  const { isPreview } = config;

  root.innerHTML = "";

  const mechanic = new Mechanic(func.settings, values, config);
  const onFrame = el => {
    // Pending virtual-dom approach
    root.innerHTML = el.trim();
    if (!isPreview) {
      mechanic.frame(root.childNodes[0], { head });
    }
  };
  const onDone = async (el, name) => {
    root.innerHTML = el.trim();
    if (!isPreview) {
      await mechanic.done(root.childNodes[0], { head });
      mechanic.download(name || functionName);
    }
  };
  const onSetState = async obj => {
    mechanic.setState(obj);
  };

  func.handler({
    inputs: mechanic.values,
    mechanic: {
      frame: onFrame,
      done: onDone,
      state: mechanic.functionState,
      setState: onSetState
    }
  });
  return mechanic;
};
