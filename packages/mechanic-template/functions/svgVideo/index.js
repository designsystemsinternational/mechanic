export const handler = async (params, mechanic) => {
  const r = params.width / 3;
  let x = 0;

  const drawFrame = () => {
    const svg = `<svg width="${params.width}" height="${params.height}">
      <rect x="0" y="0" width="${params.width}" height="${
      params.height
    }" stroke="none" fill="red" />
      <ellipse cx="${x}" cy="${params.height / 2}" rx="${r}" ry="${r}" stroke="none" fill="cyan" />
    </svg>`;

    mechanic.frame(svg);

    x++;

    if (x < params.width) {
      mechanic.requestAnimationFrame(drawFrame);
    } else {
      mechanic.done(svg);
    }
  };

  drawFrame();
};

// This will need to be parsed into a JSON file for the API
// We will probably do this with a webpack loader
// We also need a nicer API to create this file
export const params = {
  width: {
    type: "integer",
    default: 400
  },
  height: {
    type: "integer",
    default: 300
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
  animated: true
};
