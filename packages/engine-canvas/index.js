import { Mechanic } from '@mechanic-design/core';

const root = document.getElementById('root');

export const run = (functionName, func, values, config) => {
  const { isPreview } = config;

  root.innerHTML = '';

  const mechanic = new Mechanic(func.settings, values, config);

  // TODO: If the canvas is provided by the handle we don't need to remove the
  // existing canvas on every frame.
  let isElAdded = false;
  let shouldStopOnNextFrame = false;

  const onFrame = (el) => {
    if (shouldStopOnNextFrame) {
      finalizeFunction(el);
    } else {
      if (isElAdded) {
        root.removeChild(root.childNodes[0]);
      }

      root.appendChild(el);
      isElAdded = true;

      if (!isPreview) {
        mechanic.frame(el);
      }
    }
  };

  const onDone = () => (shouldStopOnNextFrame = true);

  const finalizeFunction = async (el, name) => {
    mechanic.drawLoop.stop();
    if (isElAdded) {
      root.removeChild(root.childNodes[0]);
    }

    root.appendChild(el);
    isElAdded = true;

    if (!isPreview) {
      await mechanic.done(el);
      mechanic.download(name || functionName);
    }
  };
  const onSetState = async (obj) => {
    mechanic.setState(obj);
  };

  mechanic.drawLoop.maybeDisptach(async ({ frameCount }) => {
    const canvas = await func.handler({
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
      onFrame(canvas);
    }
  }, mechanic.shouldUseControlledDrawloop());

  return mechanic;
};
