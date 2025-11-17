export const handler = async ({ inputs, frame, done, drawLoop, getCanvas }) => {
  const { width, height, text, color1, color2, radiusPercentage, turns } =
    inputs;

  const center = [width / 2, height / 2];
  const radius = ((height / 2) * radiusPercentage) / 100;

  const { ctx } = getCanvas(width, height);

  // frameCount has the number of the current frame, this is based on the framerate
  // your animation is running it. For 60 fps the frame at 1 seconds will be 60, while
  // at 24 fps it will be 24.
  //
  // timestamp has the frame offset in seconds and is always the same, no matter the
  // framerate.
  drawLoop(({ frameCount, timestamp }) => {
    const angle = Math.PI * timestamp;

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

    const textWithFrameCount = `${text} ${frameCount}`;
    ctx.strokeText(textWithFrameCount, width / 2, height - height / 20);
    ctx.fillText(textWithFrameCount, width / 2, height - height / 20);

    if (angle < turns * 2 * Math.PI) {
      frame();
    } else {
      done();
    }
  });
};

export const inputs = {
  width: {
    type: "number",
    default: 400
  },
  height: {
    type: "number",
    default: 300
  },
  text: {
    type: "text",
    default: "mechanic"
  },
  color1: {
    type: "color",
    model: "hex",
    default: "#E94225"
  },
  color2: {
    type: "color",
    model: "hex",
    default: "#002EBB"
  },
  radiusPercentage: {
    type: "number",
    default: 40,
    min: 0,
    max: 100,
    slider: true
  },
  turns: {
    type: "number",
    default: 3
  }
};

export const presets = {
  medium: {
    width: 800,
    height: 600
  },
  large: {
    width: 1600,
    height: 1200
  }
};

export const settings = {
  engine: require("@mechanic-design/engine-canvas"),
  animated: true
};
