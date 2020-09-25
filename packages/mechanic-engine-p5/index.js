import { Mechanic } from "@designsystemsinternational/mechanic-utils";
import p5 from "p5";

const root = document.getElementById("root");

let p5Sketch;

export const run = (functionName, func, values, isPreview) => {
  if (p5Sketch) {
    p5Sketch.remove();
  }
  const mechanic = new Mechanic(func.params, func.settings, values);
  const onFrame = () => {
    if (!isPreview) {
      mechanic.frame(root.childNodes[0]);
    }
  };
  const onDone = async () => {
    p5Sketch.noLoop();
    if (!isPreview) {
      await mechanic.done(root.childNodes[0]);
      mechanic.download(functionName);
    }
  };
  p5Sketch = new p5(
    (sketch) =>
      func.handler(sketch, mechanic.values, { frame: onFrame, done: onDone }),
    root
  );
};
