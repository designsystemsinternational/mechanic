export const handler = ({ inputs, mechanic }) => {
  const { width, height, text, color1, color2, hello, point1, point2 } = inputs;

  const center = [width / 2, height / 2];
  const radius = ((height / 2) * 10) / 100;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#F4F4F4";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < hello.length; i++) {
    for (let j = 0; j < hello[i]; j++) {
      const center = [
        Math.random() * width,
        ((i + 1) * ((18 * height) / 20)) / hello.length,
      ];
      const angle = Math.random() * Math.PI * 2;
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
    }
  }

  ctx.fillStyle = "#000000";
  ctx.font = `${height / 10}px sans-serif`;
  ctx.textAlign = "center";
  if (point1) {
    ctx.strokeText(text, point1.x, point1.y);
    ctx.fillText(text, point1.x, point1.y);
  } else {
    ctx.strokeText(text, width / 2, height - height / 20);
    ctx.fillText(text, width / 2, height - height / 20);
  }

  if (point2) {
    ctx.fillRect(point2.x, point2.y, 100, 100);
  }

  mechanic.done(canvas);
};

export const inputs = {
  hello: {
    type: "my-input-1",
    default: [0],
  },
  point1: {
    type: "custom-2",
  },
  point2: {
    type: "custom-2",
  },
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
