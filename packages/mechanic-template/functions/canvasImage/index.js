export const handler = (params, mechanic) => {
  const { width, height, primaryColor, secondaryColor, numberOfRects } = params;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = secondaryColor;
  const rectWidth = (width - 200 - 10 * (numberOfRects - 1)) / numberOfRects
  for(let index = 0; index < numberOfRects; index++) {
    ctx.fillRect(100 + index * (rectWidth + 10), 100, rectWidth, height - 200);
  }
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
    choices: ['#00FFFF', '#00FFFF', '#00FFFF'],
    default: '#00FFFF'
  },
  numberOfRects: {
    type: 'integer',
    default: 1
  }
};

export const settings = {
  engine: "canvas"
};
