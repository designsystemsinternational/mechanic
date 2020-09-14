export const handler = (params, mechanic) => {
  const { width, height, background, color1, color2, numberOfSquares } = params;
  const colors = [color1, color2];

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < numberOfSquares; i++) {
    ctx.fillStyle = colors[i % 2];
    ctx.fillRect(Math.random() * width, Math.random() * height, width * 0.2, height * 0.2);
  }
  mechanic.done(canvas);
};

// This will need to be parsed into a JSON file for the API
// We will probably do this with a webpack loader
// We also need a nicer API to create this file
export const params = {
  width: {
    type: "number",
    default: 1600
  },
  height: {
    type: "number",
    default: 1600
  },
  background: {
    type: "color",
    default: "#333333"
  },
  color1: {
    type: "color",
    default: "#FF00FF",
    options: ["#FF00FF", "#0000FF", "#FF0000"]
  },
  color2: {
    type: "color",
    default: "#0000FF",
    options: ["#FF00FF", "#0000FF", "#FF0000"]
  },
  numberOfSquares: {
    type: "number",
    default: 2
  }
};

export const settings = {
  engine: require("mechanic-engine-canvas").run,
  usesRandom: true
};
