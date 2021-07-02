export const handler = (sketch, params, mechanic) => {
  const { width, height } = params;

  let x = 0;
  const y = height / 2;

  sketch.setup = () => {
    sketch.createCanvas(width, height);
  };

  sketch.draw = () => {
    sketch.background(primaryColor);
    sketch.fill(secondaryColor);
    sketch.rect(x, y, width / 3, width / 3);

    x++;

    if (x < width) {
      mechanic.frame();
    } else {
      mechanic.done();
    }
  };
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
};

export const presets = {
  medium: {
    width: 800,
    height: 600,
  },
};

export const settings = {
  engine: require("@designsystemsinternational/mechanic-engine-p5").run,
  animated: true,
};
