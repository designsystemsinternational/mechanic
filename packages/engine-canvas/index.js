import { Mechanic } from '@mechanic-design/core';

const root = document.getElementById('root');

export const run = (functionName, func, values, config) => {
  const { isPreview } = config;

  root.innerHTML = '';

  const mechanic = new Mechanic(func.settings, values, config);

  let isElAdded = false;

  mechanic.registerFrameCallback((el) => {
    if (isElAdded) {
      root.removeChild(root.childNodes[0]);
    }

    root.appendChild(el);
    isElAdded = true;

    if (!isPreview) {
      mechanic.frame(el);
    }
  });

  mechanic.registerFinalizeCallback(async (el) => {
    mechanic.drawLoop.stop();
    if (isElAdded) {
      root.removeChild(root.childNodes[0]);
    }

    root.appendChild(el);
    isElAdded = true;

    if (!isPreview) {
      await mechanic.done(el);
      mechanic.download(functionName);
    }
  });

  mechanic.dispatch(async ({ frameCount }) => {
    mechanic.maybeAddFrame(
      await func.handler({
        inputs: mechanic.values,
        frameCount,
        mechanic: mechanic.getCallbacksForHandler(),
      })
    );
  });

  return mechanic;
};
