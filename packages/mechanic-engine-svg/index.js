import { Mechanic } from "@designsystemsinternational/mechanic-utils";

const root = document.getElementById("root");

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

  const onDone = async (el) => {
    root.innerHTML = el.trim();
    if (!isPreview) {
      await mechanic.done(root.childNodes[0]);
      mechanic.download(`${functionName}-${getTimeStamp()}`);
    }
  };

  func.handler(mechanic.values, { frame: onFrame, done: onDone });
};
