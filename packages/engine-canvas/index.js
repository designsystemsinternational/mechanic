import { Mechanic } from '@mechanic-design/core';

const root = document.getElementById('root');

export const run = (functionName, func, values, config) => {
  const { isPreview } = config;

  root.innerHTML = '';

  const mechanic = new Mechanic(func.settings, values, config);

  let isElAdded = false;

  mechanic.dispatch({
    frameHandler: (el) => {
      mechanic.frameOrDone({
        frame: () => {
          if (isElAdded) {
            root.removeChild(root.childNodes[0]);
          }

          root.appendChild(el);
          isElAdded = true;

          if (!isPreview) {
            mechanic.frame(el);
          }
        },
        done: async () => {
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
        },
      });
    },
    renderFrame: async ({ frameCount }) => {
      mechanic.maybeAddFrame(
        await func.handler({
          inputs: mechanic.values,
          frameCount,
          mechanic: mechanic.getCallbacksForHandler(),
        })
      );
    },
  });

  return mechanic;
};
