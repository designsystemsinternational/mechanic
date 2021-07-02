export const handler = async (params, mechanic) => {
  const { width, height } = params;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  let x = 0;

  const drawFrame = () => {
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "blue";
    ctx.fillRect(x, height / 2, width / 3, width / 3);
    mechanic.frame(canvas);

    x++;

    if (x < width) {
      window.requestAnimationFrame(drawFrame);
    } else {
      mechanic.done(canvas);
    }
  };

  drawFrame();
};

export const params = {
  width: {
    type: "number",
    default: 400,
  },
  height: {
    type: "number",
    default: 300,
  },
};

export const presets = {
  medium: {
    width: 800,
    height: 600,
  },
};

export const settings = {
  engine: require("@designsystemsinternational/mechanic-engine-canvas").run,
  animated: true,
};
