export const handler = ({ params, mechanic, sketch }) => {
  const { width, height, primaryColor, secondaryColor, maxFrames } = params;

  let x = 0;
  const y = height / 2;
  let frames = 0;
  sketch.setup = () => {
    sketch.createCanvas(width, height);
  };

  sketch.draw = () => {
    sketch.background(primaryColor);
    sketch.fill(secondaryColor);
    sketch.rect(x, y, width / 3, width / 3);

    x++;

    if (frames < maxFrames && x < width) {
      mechanic.frame();
      frames += 1;
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
  primaryColor: {
    type: "color",
    default: "#FF0000",
  },
  secondaryColor: {
    type: "color",
    default: "#00FFFF",
  },
  maxFrames: {
    type: "number",
    default: 100,
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
  engine: require("@designsystemsinternational/mechanic-engine-p5"),
  animated: true,
};
