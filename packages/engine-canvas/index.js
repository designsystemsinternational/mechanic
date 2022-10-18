import { Mechanic } from "@mechanic-design/core";

const root = document.getElementById("root");

export const run = (functionName, func, values, config) => {
  const { isPreview } = config;

  root.innerHTML = "";

  let isElAdded = false;

  const mechanic = new Mechanic(func.settings, values, config);

  mechanic.registerFrameCallback(el => {
    if (!isElAdded) {
      isElAdded = true;
      root.appendChild(el);
    }
    if (!isPreview) {
      mechanic.frame(el);
    }
  });

  mechanic.registerDoneCallback(async (el, name) => {
    if (!isElAdded) {
      isElAdded = true;
      root.appendChild(el);
    }
    if (!isPreview) {
      await mechanic.done(el);
      mechanic.download(name || functionName);
    }
  });

  func.handler({
    inputs: mechanic.values,
    ...mechanic.callbacksForEngine()
  });

  return mechanic;
};
