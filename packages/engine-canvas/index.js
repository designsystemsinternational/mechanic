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
    : mechanic.exportDensity;

  const preparedCanvas = document.createElement('canvas');
  const preparedCanvasContext = preparedCanvas.getContext('2d');

  if (mechanic.values.width && mechanic.values.height) {
    const width = mechanic.values.width;
    const height = mechanic.values.height;

    preparedCanvas.width = width * canvasDensity;
    preparedCanvas.height = height * canvasDensity;

    preparedCanvas.style.width = `${width}px`;
    preparedCanvas.style.height = `${height}px`;

    preparedCanvasContext.scale(canvasDensity, canvasDensity);
  } else {
    console.warn(`No width and height inputs found for ${functionName}.

This is no problem though. Just make sure to set width and height on the canvas element provided by the renderer yourself.

canvas.width = 1000;
canvas.height = 1000;`);
  }

  let isElAdded = false;
  const onFrame = (el) => {
    if (!isElAdded) {
      isElAdded = true;
      root.appendChild(el);
    }
    if (!isPreview) {
      mechanic.frame(el);
    }
  };
  const onDone = async (el, name) => {
    if (!isElAdded) {
      isElAdded = true;
      root.appendChild(el);
    }
    if (!isPreview) {
      await mechanic.done(el);
      mechanic.download(name || functionName);
    }
  };
  const onSetState = async (obj) => {
    mechanic.setState(obj);
  };

  func.handler({
    inputs: mechanic.values,
    mechanic: {
      frame: onFrame,
      done: onDone,
      state: mechanic.functionState,
      setState: onSetState,
    },
    canvas: preparedCanvas,
    ctx: preparedCanvasContext,
  });
  return mechanic;
};

export const isRasterExport = true;
