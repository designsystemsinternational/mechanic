export const handler = async (sketch, params, mechanic) => {
  let x = 0;
  sketch.setup = () => {
    sketch.createCanvas(params.width, params.height);
  };

  sketch.draw = () => {
    sketch.background(255, 0, 0);
    sketch.fill(0, 255, 255);
    sketch.rect(x, params.height / 2, params.width / 3, params.width / 3);

    x++;

    if (x < params.width) {
      mechanic.frame();
    } else {
      mechanic.done();
    }
  };
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
  engine: "p5",
  animated: true
};
