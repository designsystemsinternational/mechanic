import { Mechanic } from '@mechanic-design/core';

const root = document.getElementById('root');
const head = document.querySelector('head');

export const run = (functionName, func, values, config) => {
  const { isPreview } = config;

  root.innerHTML = '';

  const mechanic = new Mechanic(func.settings, values, config);

  mechanic.registerFrameCallback((el) => {
    root.innerHTML = el.trim();
    if (!isPreview) {
      mechanic.frame(root.childNodes[0], { head });
    }
  });

  mechanic.registerFinalizeCallback(async (el) => {
    mechanic.drawLoop.stop();
    root.innerHTML = el.trim();
    if (!isPreview) {
      await mechanic.done(root.childNodes[0], { head });
      mechanic.download(name || functionName);
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
