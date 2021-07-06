export const handler = (params, mechanic) => {
  const { width, height } = params;

  let x = 0;
  const drawFrame = () => {
    const svg = `<svg width="${width}" height="${height}">
      <rect x="0" y="0" width="${width}" height="${height}" stroke="none" fill="red" />
      <ellipse cx="${x}" cy="${height / 2}" rx="${width / 2}" ry="${
      width / 2
    }" stroke="none" fill="cyan" />
    </svg>`;

    if (x < width) {
      mechanic.frame(svg);
      x++;
      window.requestAnimationFrame(drawFrame);
    } else {
      mechanic.done(svg);
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
  engine: require("@designsystemsinternational/mechanic-engine-svg").run,
  animated: true,
};
