import engine from "mechanic-canvas-engine";

export const handler = (params, mechanic) => {
  const {
    width,
    height,
    primaryColor,
    secondaryColor,
    numberOfRects,
    hasOuterMargin,
    innerMargin,
    topMargin,
    bottomMargin,
    leftMargin,
    rightMargin
  } = params;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = secondaryColor;
  const margin = {
    top: hasOuterMargin ? topMargin : 0,
    right: hasOuterMargin ? rightMargin : 0,
    bottom: hasOuterMargin ? bottomMargin : 0,
    left: hasOuterMargin ? leftMargin : 0
  };
  const rectWidth =
    (width - margin.left - margin.right - innerMargin * (numberOfRects - 1)) / numberOfRects;
  for (let index = 0; index < numberOfRects; index++) {
    ctx.fillRect(
      margin.left + index * (rectWidth + innerMargin),
      margin.top,
      rectWidth,
      height - margin.top - margin.bottom
    );
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
  },
  innerMargin: {
    type: "integer",
    default: 10
  },
  topMargin: {
    type: "integer",
    default: 100
  },
  bottomMargin: {
    type: "integer",
    default: 100
  },
  leftMargin: {
    type: "integer",
    default: 100
  },
  rightMargin: {
    type: "integer",
    default: 100
  }
};

export const settings = {
  engine
};
