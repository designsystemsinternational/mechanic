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
      ...mechanic.callbacksForDesignFunction({
        drawLoop: () => {
          throw new Error(
            "drawLoop is not supported in engine p5, as p5 provides its own draw loop. Use sketch.setup and sketch.draw instead."
          );
        }
      }),
      sketch
    });
  }, root);
  return mechanic;
};
