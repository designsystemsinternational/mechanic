export const buildCanvasDimensions = ({
  width,
  height,
  mechanic,
  isPreview
}) => {
  const dimensions = {
    width: width ?? mechanic.values.width ?? null,
    height: height ?? mechanic.values.height ?? null,

    // A canvas will always be previewed at the pixel density of the display
    // it's currently being viewed on to keep render speeds reasonable.
    //
    // TODO: Appliying pixel density to the export is intentionally out of scope
    // to keep this PR small. We should add this in a follow-up PR. And then
    // also make sure to add this to SVG and HTML exports when they are
    // transformed to PNG.
    pixelDensity: isPreview ? window.devicePixelRatio || 1 : 1
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

  return dimensions;
};

export const prepareCanvas = ({ width, height, pixelDensity = 1 }) => {
  const canvas = document.createElement("canvas");
  canvas.width = width * pixelDensity;
  canvas.height = height * pixelDensity;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");
  ctx.scale(pixelDensity, pixelDensity);

  return { canvas, ctx };
};
