import { Mechanic } from "@designsystemsinternational/mechanic-utils";

const root = document.getElementById("root");

export const run = (functionName, func, values, isPreview) => {
  root.innerHTML = "";

  const mechanic = new Mechanic(func.params, func.settings, values);

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

  const onDone = async (el) => {
    if (!isElAdded) {
      isElAdded = true;
      root.appendChild(el);
    }
    if (!isPreview) {
      await mechanic.done(el);
      mechanic.download(functionName);
    }
  };

  func.handler(mechanic.values, { frame: onFrame, done: onDone });
  return mechanic;
};
