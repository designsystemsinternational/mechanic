import { Mechanic } from "@mechanic-design/core";

const root = document.getElementById("root");

export const run = (functionName, func, values, isPreview) => {
  root.innerHTML = "";

  const mechanic = new Mechanic(func.inputs, func.settings, values);

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

  func.handler({
    inputs: mechanic.values,
    mechanic: { frame: onFrame, done: onDone },
  });
  return mechanic;
};
