import { Mechanic } from "@mechanic-design/core";
import { buildCanvasDimensions, prepareCanvas } from "./prepare-canvas.js";

const root = document.getElementById("root");

export const run = (functionName, func, values, config) => {
  const { isPreview } = config;

  root.innerHTML = "";

  let isElAdded = false;
  let preparedCanvas = null;

  const mechanic = new Mechanic(func.settings, values, config);

  // This ensures backwards compatibility for function's building their own
  // canvas. This keeps the engine backwards compatible and allows users to
  // opt-out of the assumptions the prepared canvas makes if they need to.
  const checkForCanvas = el => {
    if (!el && !preparedCanvas) {
      throw new Error(
        `You need to call getCanvas() before calling either frame() or done(), or pass your own canvas element as an argument to either function.`
      );
    }
  };

  mechanic.registerFrameCallback(el => {
    checkForCanvas(el);

    if (!isElAdded) {
      isElAdded = true;
      root.appendChild(preparedCanvas?.canvas ?? el);
    }
    if (!isPreview) {
      mechanic.frame(preparedCanvas?.canvas ?? el);
    }
  });

  mechanic.registerDoneCallback(async (el, name) => {
    checkForCanvas(el);

    if (!isElAdded) {
      isElAdded = true;
      root.appendChild(preparedCanvas?.canvas ?? el);
    }
    if (!isPreview) {
      await mechanic.done(preparedCanvas?.canvas ?? el);
      mechanic.download(name || functionName);
    }
  });

  func.handler({
    inputs: mechanic.values,
    ...mechanic.callbacksForDesignFunction({
      getCanvas: (width = null, height = null) => {
        if (preparedCanvas !== null) return preparedCanvas;

        const dimensions = buildCanvasDimensions({
          width,
          height,
          mechanic,
          isPreview
        });

        return (preparedCanvas = prepareCanvas(dimensions));
      }
    })
  });

  return mechanic;
};
