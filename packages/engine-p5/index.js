import { Mechanic } from '@mechanic-design/core';
import p5 from 'p5';

const root = document.getElementById('root');

let p5Sketch;

export const run = (functionName, func, values, config) => {
  const { isPreview } = config;

  let shouldStopOnNextFrame = false;

  if (p5Sketch) {
    p5Sketch.remove();
  }
  const mechanic = new Mechanic(func.settings, values, config);
  const onFrame = () => {
    if (shouldStopOnNextFrame) {
      finalizeFunction();
    } else if (!isPreview) {
      mechanic.frame(root.childNodes[0]);
    }
  };

  const onDone = () => (shouldStopOnNextFrame = true);

  const finalizeFunction = async (name) => {
    p5Sketch.noLoop();
    if (!isPreview) {
      await mechanic.done(root.childNodes[0]);
      mechanic.download(name || functionName);
    }
  };
  const onSetState = async (obj) => {
    mechanic.setState(obj);
  };

  if (mechanic.shouldUseControlledDrawloop()) {
    console.warn(
      'The p5-engine does not support controlled drawloop. p5.js comes with its own drawloop.'
    );
  }

  p5Sketch = new p5((sketch) => {
    sketch.frameRate(mechanic.settings.frameRate);

    return func.handler({
      inputs: mechanic.values,
      mechanic: {
        frame: onFrame,
        done: onDone,
        draw: () => {
          console.warn(
            'You don’t need to use mechanic.draw() in the p5-engine as p5.js comes with its own drawloop'
          );
        },
        state: mechanic.functionState,
        setState: onSetState,
      },
      sketch,
    });
  }, root);
  return mechanic;
};
