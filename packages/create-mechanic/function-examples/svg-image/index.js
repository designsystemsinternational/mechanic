export const handler = (params, mechanic) => {
  const r = params.radius;
  const svg = `<svg width="${params.width}" height="${params.height}">
    <rect x="0" y="0" width="${params.width}" height="${
    params.height
  }" stroke="none" fill="red" />
    <ellipse cx="${params.width / 2}" cy="${params.height / 2}" rx="${
    width / 2
  }" ry="${width / 2}" stroke="none" fill="cyan" />
  </svg>`;
  mechanic.done(svg);
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
};
