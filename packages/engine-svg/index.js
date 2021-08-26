import { Mechanic } from "@mechanic-design/core";

const root = document.getElementById("root");
const head = document.querySelector("head");

export const run = (functionName, func, values, isPreview) => {
  root.innerHTML = "";

  const mechanic = new Mechanic(func.params, func.settings, values);

  const onFrame = (el) => {
    // Pending virtual-dom approach
    root.innerHTML = el.trim();
    if (!isPreview) {
      mechanic.frame(root.childNodes[0]);
    }
  };

  const onDone = async (el, name) => {
    root.innerHTML = el.trim();
    if (!isPreview) {
      await mechanic.done(root.childNodes[0], { head });
      mechanic.download(name || functionName);
    }
  };

  func.handler({
    params: mechanic.values,
    mechanic: { frame: onFrame, done: onDone },
  });
  return mechanic;
};
