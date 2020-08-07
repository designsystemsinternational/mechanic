export const handler = (params, mechanic) => {
  const { width, height, primaryColor, secondaryColor, numberOfRects, hasOuterMargin } = params;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = secondaryColor;
  const margin = hasOuterMargin ? 200 : 0;
  const rectWidth = (width - margin - 10 * (numberOfRects - 1)) / numberOfRects;
  for (let index = 0; index < numberOfRects; index++) {
    ctx.fillRect(margin / 2 + index * (rectWidth + 10), margin / 2, rectWidth, height - margin);
  }
  mechanic.done(canvas);
};

// This will need to be parsed into a JSON file for the API
// We will probably do this with a webpack loader
// We also need a nicer API to create this file
export const params = {
  size: {
    default: {
      width: 400,
      height: 300
    },
    medium: {
      width: 800,
      height: 600
    },
    large: {
      width: 1600,
      height: 1200
    },
    xlarge: {
      width: 3200,
      height: 2400
    }
  },
  primaryColor: {
    type: "string",
    default: "#FF0000"
  },
  secondaryColor: {
    type: "string",
    choices: ["#00FFFF", "#FF00FF", "#FFFF00"],
    default: "#00FFFF"
  },
  numberOfRects: {
    type: "integer",
    default: 2
  },
  hasOuterMargin: {
    type: "boolean",
    default: true
  }
};

export const settings = {
  engine: "canvas"
};
