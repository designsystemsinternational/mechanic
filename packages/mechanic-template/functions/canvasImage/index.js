export const handler = (params, mechanic) => {
  const canvas = document.createElement("canvas");
  canvas.width = params.width;
  canvas.height = params.height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = params.primaryColor;
  ctx.fillRect(0, 0, params.width, params.height);
  ctx.fillStyle = params.secondaryColor;
  ctx.fillRect(100, 100, params.width - 200, params.height - 200);
  mechanic.done(canvas);
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
  primaryColor: {
    type: 'string',
    default: '#FF0000'
  },
  secondaryColor: {
    type: 'string',
    default: '#00FFFF'
  }
};

export const settings = {
  engine: "canvas"
};
