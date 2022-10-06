import { Mechanic } from '@mechanic-design/core';

const root = document.getElementById('root');

export const run = (functionName, func, values, config) => {
  const { isPreview } = config;

  root.innerHTML = '';

  const mechanic = new Mechanic(func.settings, values, config);

  // Preview is always going to use the pixel density of the
  // screen we're currently on.
  //
  // Export will respect the density setting made by the user
  const canvasDensity = isPreview
    ? window.devicePixelRatio || 1
    : mechanic.exportDensity || 1;

  // Mutable variable in global engine scope to keep track of the prepared
  // canvas we hand to the user
  let isElAdded = false;
  let preparedCanvas = null;

  const getCanvas = ({ width = null, height = null } = {}) => {
    const dimensions = {
      width: width ?? mechanic.values.width ?? null,
      height: height ?? mechanic.values.height ?? null,
    };

    if (!dimensions.width && !dimensions.height) {
      throw new Error(`No width and height values were provided to the canvas.
You can set a width and height values by passing them the getCanvas function:
getCanvas({ width: 1000, height: 1000 });
You can also set width and height by adding an input called width and height to your functions’ inputs.
`);
    }

    if (!dimensions.width) {
      throw new Error(`No width value was provided to the canvas.
You can set a width value by passing it the getCanvas function:
getCanvas({ width: 1000 });
You can also set a width by adding an input called width to your functions’ inputs.
`);
    }

    if (!dimensions.height) {
      throw new Error(`No height value was provided to the canvas.
You can set a height value by passing it the getCanvas function:
getCanvas({ height: 1000 });
You can also set a height by adding an input called height to your functions’ inputs.
`);
    }

    preparedCanvas = document.createElement('canvas');
    preparedCanvas.width = dimensions.width * canvasDensity;
    preparedCanvas.height = dimensions.height * canvasDensity;
    preparedCanvas.style.width = `${dimensions.width}px`;
    preparedCanvas.style.height = `${dimensions.height}px`;

    const ctx = preparedCanvas.getContext('2d');

    ctx.scale(canvasDensity, canvasDensity);

    return { canvas: preparedCanvas, ctx };
  };

  const checkIfCanvasHasBeenCalled = () => {
    if (preparedCanvas === null) {
      console.warn(`Seems like you’re constructing your own canvas. @mechanic-design/engine-canvas actually provides you with a canvas that can automatically scale to the pixel density of your display.
You can use it like this:
export const handler = ({ inputs, mechanic, getCanvas }) => {
  const { canvas, ctx } = getCanvas({ width: 1000, height: 1000 });
  ...
`);
    }
  };

  mechanic.registerFrameCallback((el) => {
    checkIfCanvasHasBeenCalled();

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
    checkIfCanvasHasBeenCalled();

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
        mechanic: {
          ...mechanic.getCallbacksForHandler(),
          getCanvas,
        },
      })
    );
  });

  return mechanic;
};
