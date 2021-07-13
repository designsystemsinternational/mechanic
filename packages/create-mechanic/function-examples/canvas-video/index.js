export const handler = async (params, mechanic) => {
  const { width, height, primaryColor, secondaryColor, maxFrames } = params;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  let x = 0;
  let frames = 0;

  const drawFrame = () => {
    ctx.fillStyle = primaryColor;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(x, height / 2, width / 3, width / 3);
    mechanic.frame(canvas);

    x++;

    if (frames < maxFrames && x < width) {
      frames += 1;
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
  primaryColor: {
    type: "color",
    default: "#FF0000",
  },
  secondaryColor: {
    type: "color",
    default: "#00FFFF",
  },
  maxFrames: {
    type: "number",
    default: 100,
  },
};

export const presets = {
  medium: {
    width: 800,
    height: 600,
  },
  large: {
    width: 1600,
    height: 1200,
  },
  xLarge: {
    width: 3200,
    height: 2400,
  },
};

export const settings = {
  engine: require("@designsystemsinternational/mechanic-engine-canvas"),
  animated: true,
};
