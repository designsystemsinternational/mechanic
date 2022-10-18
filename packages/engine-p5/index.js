import { Mechanic } from "@mechanic-design/core";
import p5 from "p5";

const root = document.getElementById("root");

let p5Sketch;

export const run = (functionName, func, values, config) => {
  const { isPreview } = config;
  if (p5Sketch) {
    p5Sketch.remove();
  }
  const mechanic = new Mechanic(func.settings, values, config);

  mechanic.registerFrameCallback(() => {
    if (!isPreview) {
      mechanic.frame(root.childNodes[0]);
    }
  });

  mechanic.registerDoneCallback(async name => {
    p5Sketch.noLoop();
    if (!isPreview) {
      await mechanic.done(root.childNodes[0]);
      mechanic.download(name || functionName);
    }
  });

  p5Sketch = new p5(sketch => {
    sketch.frameRate(mechanic.settings.frameRate);
    return func.handler({
      inputs: mechanic.values,
      ...mechanic.callbacksForEngine(),
      sketch
    });
  }, root);
  return mechanic;
};
