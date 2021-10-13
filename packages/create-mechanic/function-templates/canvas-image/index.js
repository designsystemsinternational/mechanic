export const handler = ({ inputs, mechanic }) => {
  const { width, height, text, color1, color2, radiusPercentage } = inputs;

  const center = [width / 2, height / 2];
  const radius = ((height / 2) * radiusPercentage) / 100;
  const angle = Math.random() * Math.PI * 2;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#F4F4F4";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = color1;
  ctx.beginPath();
  ctx.arc(
    center[0],
    center[1],
    radius,
    Math.PI + angle,
    2 * Math.PI + angle,
    false
  );
  ctx.fill();

  ctx.fillStyle = color2;
  ctx.beginPath();
  ctx.arc(center[0], center[1], radius, 0 + angle, Math.PI + angle, false);
  ctx.fill();

  ctx.fillStyle = "#000000";
  ctx.font = `${height / 10}px sans-serif`;
  ctx.textAlign = "center";
  ctx.strokeText(text, width / 2, height - height / 20);
  ctx.fillText(text, width / 2, height - height / 20);

  mechanic.done(canvas);
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
  engine: require("@mechanic-design/engine-canvas"),
};
