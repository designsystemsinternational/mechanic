export const handler = async (params, mechanic) => {
  const {width, height, primaryColor, secondaryColor, maxFrames} = params;

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
    type: "string",
    default: "#FF0000"
  },
  secondaryColor: {
    type: "string",
    default: "#00FFFF"
  },
  maxFrames: {
    type: "integer",
    default: 100
  }
};

export const settings = {
  engine: "canvas",
  animated: true
};
