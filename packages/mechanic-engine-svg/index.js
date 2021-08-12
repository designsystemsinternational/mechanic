import { Mechanic } from "@designsystemsinternational/mechanic";

const root = document.getElementById("root");
const styles = document.querySelectorAll("head style");

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
      await mechanic.done(root.childNodes[0], { styles });
      mechanic.download(name || functionName);
    }
  };

  func.handler(mechanic.values, { frame: onFrame, done: onDone });
  return mechanic;
};
