export const handler = async (params, mechanic) => {
  const r = params.radius;
  let x = 0;

  const drawFrame = () => {
    const svg = `<svg width="${params.width}" height="${params.height}">
      <rect x="0" y="0" width="${params.width}" height="${
      params.height
    }" stroke="none" fill="red" />
      <ellipse cx="${x}" cy="${params.height / 2}" rx="${r}" ry="${r}" stroke="none" fill="cyan" />
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
  },
  radius: {
    type: "integer",
    default: 100
  },
  maxFrames: {
    type: "integer",
    default: 200
  }
};

export const settings = {
  engine: "svg",
  animated: true
};
