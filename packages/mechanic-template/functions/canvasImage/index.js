export const handler = (params, mechanic) => {
  const {
    width,
    height,
    primaryColor,
    secondaryColor,
    numberOfRects,
    hasOuterMargin,
    innerMargin,
    margin
  } = params;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = secondaryColor;
  const top = hasOuterMargin ? margin.top : 0;
  const right = hasOuterMargin ? margin.right : 0;
  const bottom = hasOuterMargin ? margin.bottom : 0;
  const left = hasOuterMargin ? margin.left : 0;

  const rectWidth = (width - left - right - innerMargin * (numberOfRects - 1)) / numberOfRects;
  for (let index = 0; index < numberOfRects; index++) {
    ctx.fillRect(left + index * (rectWidth + innerMargin), top, rectWidth, height - top - bottom);
  }
  mechanic.done(canvas);
};

// This will need to be parsed into a JSON file for the API
// We will probably do this with a webpack loader
// We also need a nicer API to create this file
export const params = {
  width: {
    type: "number",
    default: 400,
    validation: v => (v < 410 || v > 420 ? null : "Out of range")
  },
  height: {
    type: "number",
    default: 300
  },
  primaryColor: {
    type: "color",
    model: "hex",
    default: "#FF0000"
  },
  secondaryColor: {
    type: "color",
    options: ["#00FFFF", "#FF00FF", "#FFFF00"],
    default: "#00FFFF"
  },
  numberOfRects: {
    type: "number",
    default: 2,
    options: [2, 3, 4]
  },
  hasOuterMargin: {
    type: "boolean",
    default: true
  },
  innerMargin: {
    type: "number",
    default: 10,
    min: 0,
    max: 30,
    step: 1,
    slider: true
  },
  margin: {
    type: "text",
    options: {
      even: { top: 100, bottom: 100, left: 100, right: 100 },
      flat: { top: 100, bottom: 100, left: 50, right: 50 },
      tall: { top: 50, bottom: 50, left: 100, right: 100 }
    },
    default: "even"
  }
};

export const presets = {
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
};

export const settings = {
  engine: require("mechanic-engine-canvas").run
};
