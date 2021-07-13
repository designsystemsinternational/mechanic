export const handler = (params, mechanic) => {
  const r = params.radius;
  let x = 0;

  const drawFrame = () => {
    const svg = `<svg width="${params.width}" height="${params.height}">
      <rect x="0" y="0" width="${params.width}" height="${
      params.height
    }" stroke="none" fill="red" />
      <ellipse cx="${x}" cy="${
      params.height / 2
    }" rx="${r}" ry="${r}" stroke="none" fill="cyan" />
    </svg>`;

    if (x < params.width && x < params.maxFrames) {
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
  radius: {
    type: "number",
    default: 10,
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
  engine: require("@designsystemsinternational/mechanic-engine-svg"),
  animated: true,
};
