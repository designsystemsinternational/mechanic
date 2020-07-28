export const handler = (params, mechanic) => {
  const r = params.height / 3;
  const svg = `<svg width="${params.width}" height="${params.height}">
    <rect x="0" y="0" width="${params.width}" height="${
    params.height
  }" stroke="none" fill="red" />
    <ellipse cx="${params.width / 2}" cy="${
    params.height / 2
  }" rx="${r}" ry="${r}" stroke="none" fill="cyan" />
  </svg>`;
  mechanic.done(svg);
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
  }
};

export const settings = {
  type: "image"
};
