import { Mechanic } from '@mechanic-design/core';
import p5 from 'p5';

const root = document.getElementById('root');

let p5Sketch;

export const run = (functionName, func, values, config) => {
  const { isPreview } = config;

  if (p5Sketch) {
    p5Sketch.remove();
  }
  const mechanic = new Mechanic(func.settings, values, config);

  if (mechanic.shouldUseControlledDrawloop()) {
    console.warn(
      'The p5-engine does not support controlled drawloop. p5.js comes with its own drawloop.'
    );
  }

  mechanic.registerFrameCallback(() => {
    if (!isPreview) {
      mechanic.frame(root.childNodes[0]);
    }
  });

  mechanic.registerFinalizeCallback(async () => {
    p5Sketch.noLoop();
    if (!isPreview) {
      await mechanic.done(root.childNodes[0]);
      mechanic.download(name || functionName);
    }
  });

  mechanic.dispatch(
    async () => {
      p5Sketch = new p5((sketch) => {
        sketch.frameRate(mechanic.settings.frameRate);

        return func.handler({
          inputs: mechanic.values,
          mechanic: {
            ...mechanic.getCallbacksForHandler(),
          },
          sketch,
        });
      }, root);
    },
    {
      ignoreBuiltInDrawLoop: true,
    }
  );

  return mechanic;
};
