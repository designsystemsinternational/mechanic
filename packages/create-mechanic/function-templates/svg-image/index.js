export const handler = ({ params, mechanic }) => {
  const { width, height, radius: r } = params;
  const svg = `<svg width="${width}" height="${height}">
    <rect x="0" y="0" width="${width}" height="${height}" stroke="none" fill="red" />
    <ellipse cx="${width / 2}" cy="${
    height / 2
  }" rx="${r}" ry="${r}" stroke="none" fill="cyan" />
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
