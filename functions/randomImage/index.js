export const handler = (params, mechanic) => {
  const canvas = document.createElement("canvas");
  canvas.width = params.width;
  canvas.height = params.height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#333333";
  ctx.fillRect(0, 0, params.width, params.height);
  ctx.fillStyle = "#FF00FF";
  ctx.fillRect(
    Math.random() * params.width,
    Math.random() * params.height,
    params.width * 0.2,
    params.height * 0.2
  );
  ctx.fillStyle = "#0000FF";
  ctx.fillRect(
    Math.random() * params.width,
    Math.random() * params.height,
    params.width * 0.2,
    params.height * 0.2
  );
  mechanic.done(canvas);
};

// This will need to be parsed into a JSON file for the API
// We will probably do this with a webpack loader
// We also need a nicer API to create this file
export const params = {
  size: {
    default: {
      width: 1600,
      height: 1600
    }
  }
};

export const settings = {
  engine: "canvas",
  usesRandom: true
};
