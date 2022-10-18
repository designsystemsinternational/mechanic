import { Mechanic } from "@mechanic-design/core";

const root = document.getElementById("root");
const head = document.querySelector("head");

export const run = (functionName, func, values, config) => {
  const { isPreview } = config;

  root.innerHTML = "";

  const mechanic = new Mechanic(func.settings, values, config);

  mechanic.registerFrameCallback(el => {
    // Pending virtual-dom approach
    root.innerHTML = el.trim();
    if (!isPreview) {
      mechanic.frame(root.childNodes[0], { head });
    }
  });

  mechanic.registerDoneCallback(async (el, name) => {
    root.innerHTML = el.trim();
    if (!isPreview) {
      await mechanic.done(root.childNodes[0], { head });
      mechanic.download(name || functionName);
    }
  });

  func.handler({
    inputs: mechanic.values,
    ...mechanic.callbacksForEngine()
  });

  return mechanic;
};
