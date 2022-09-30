import { Mechanic } from '@mechanic-design/core';

const root = document.getElementById('root');
const head = document.querySelector('head');

export const run = (functionName, func, values, config) => {
  const { isPreview } = config;

  root.innerHTML = '';

  let shouldStopOnNextFrame = false;

  const mechanic = new Mechanic(func.settings, values, config);
  const onFrame = (el) => {
    if (shouldStopOnNextFrame) {
      finalize(el);
    } else {
      // Pending virtual-dom approach
      root.innerHTML = el.trim();
      if (!isPreview) {
        mechanic.frame(root.childNodes[0], { head });
      }
    }
  };

  const onDone = () => (shouldStopOnNextFrame = true);

  const finalize = async (el, name) => {
    mechanic.drawLoop.stop();
    root.innerHTML = el.trim();
    if (!isPreview) {
      await mechanic.done(root.childNodes[0], { head });
      mechanic.download(name || functionName);
    }
  };
  const onSetState = async (obj) => {
    mechanic.setState(obj);
  };

  mechanic.drawLoop.maybeDisptach(({ frameCount }) => {
    const svg = func.handler({
      inputs: mechanic.values,
      frameCount,
      mechanic: {
        frame: onFrame,
        done: onDone,
        draw: mechanic.getDrawLoopHelper(),
        state: mechanic.functionState,
        setState: onSetState,
      },
    });

    if (mechanic.shouldUseControlledDrawloop()) {
      onFrame(svg);
    }
  }, mechanic.shouldUseControlledDrawloop());

  return mechanic;
};
