export const handler = ({ inputs, mechanic, sketch }) => {
  const { width, height, text, color1, color2, radiusPercentage, turns } =
    inputs;

  const center = [width / 2, height / 2];
  const radius = ((height / 2) * radiusPercentage) / 100;
  let angle = 0;

  sketch.setup = () => {
    sketch.createCanvas(width, height);
  };

  sketch.draw = () => {
    sketch.background("#F4F4F4");
    sketch.noStroke();

    sketch.translate(...center);
    sketch.rotate(angle);

    sketch.fill(color1);
    sketch.arc(0, 0, 2 * radius, 2 * radius, -sketch.PI, 0);
    sketch.fill(color2);
    sketch.arc(0, 0, 2 * radius, 2 * radius, 0, sketch.PI);

    sketch.rotate(-angle);

    sketch.fill("#000000");
    sketch.textAlign(sketch.CENTER, sketch.BOTTOM);
    sketch.textStyle(sketch.BOLD);
    sketch.textSize(height / 10);
    sketch.text(text, 0, height / 2 - height / 20);

    if (angle < turns * 2 * Math.PI) {
      mechanic.frame();
      angle += (2 * Math.PI) / 100;
    } else {
      mechanic.done();
    }
  };
};

export const inputs = {
  width: {
    type: "number",
    default: 400,
  },
  height: {
    type: "number",
    default: 300,
  },
  text: {
    type: "text",
    default: "mechanic",
  },
  color1: {
    type: "color",
    model: "hex",
    default: "#E94225",
  },
  color2: {
    type: "color",
    model: "hex",
    default: "#002EBB",
  },
  radiusPercentage: {
    type: "number",
    default: 40,
    min: 0,
    max: 100,
    slider: true,
  },
  turns: {
    type: "number",
    default: 3,
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
};

export const settings = {
  engine: require("@mechanic-design/engine-p5"),
  animated: true,
};
