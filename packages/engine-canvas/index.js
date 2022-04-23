import { Mechanic } from "@mechanic-design/core";

const root = document.getElementById("root");

export const run = (functionName, func, values, config) => {
  const { isPreview } = config;

  root.innerHTML = "";

  const mechanic = new Mechanic(func.settings, values, config);

  let isElAdded = false;
  const onFrame = (el) => {
    if (!isElAdded) {
      isElAdded = true;
      root.appendChild(el);
    }
    if (!isPreview) {
      mechanic.frame(el);
    }
  };
  const onDone = async (el, name) => {
    if (!isElAdded) {
      isElAdded = true;
      root.appendChild(el);
    }
    if (!isPreview) {
      await mechanic.done(el);
      mechanic.download(name || functionName);
    }
  };
  const onSetState = async (obj) => {
    mechanic.setState(obj);
  };

  func.handler({
    inputs: mechanic.values,
    mechanic: {
      frame: onFrame,
      done: onDone,
      state: mechanic.functionState,
      setState: onSetState,
      frameRate: mechanic.settings.frameRate,
    },
  });
  return mechanic;
};
