export const handler = async ({ inputs, mechanic }) => {
  const { width, height, color1, color2, radiusPercentage, turns } = inputs;

  const center = [width / 2, height / 2];
  const radius = ((height / 2) * radiusPercentage) / 100;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  let angle = 0;

  // Achieving an event based (n turns of the circle) animation logic by using
  // the provided drawloop helper.
  mechanic.draw(() => {
    angle += 0.25;
    ctx.fillStyle = '#F4F4F4';
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

    ctx.fillStyle = '#000000';
    ctx.font = `${height / 10}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(angle, width / 2, height - height / 20);

    if (angle > turns * 2 * Math.PI) {
      mechanic.done();
    }

    mechanic.frame(canvas);
  });
};

export const inputs = {
  width: {
    type: 'number',
    default: 400,
  },
  height: {
    type: 'number',
    default: 300,
  },
  color1: {
    type: 'color',
    model: 'hex',
    default: '#E94225',
  },
  color2: {
    type: 'color',
    model: 'hex',
    default: '#002EBB',
  },
  radiusPercentage: {
    type: 'number',
    default: 40,
    min: 0,
    max: 100,
    slider: true,
  },
  turns: {
    type: 'number',
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
  engine: require('@mechanic-design/engine-canvas'),
  mode: 'animation-custom',
  frameRate: 60,
};
