export const handler = async (params, mechanic) => {
  const canvas = document.createElement("canvas");
  canvas.width = params.width;
  canvas.height = params.height;
  const ctx = canvas.getContext("2d");

  let x = 0;

  const drawFrame = () => {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0, 0, params.width, params.height);
    ctx.fillStyle = "#00FFFF";
    ctx.fillRect(x, params.height / 2, params.width / 3, params.width / 3);
    mechanic.frame(canvas);

    x++;

    if (x < params.width) {
      mechanic.requestAnimationFrame(drawFrame);
    } else {
      mechanic.done(canvas);
    }
  };

  drawFrame();

  return canvas;
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
  type: "video"
};
