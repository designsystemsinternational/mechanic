export function getRandomColor() {
  return (
    "#" + (0x1000000 + Math.random() * 0xffffff).toString(16).substring(1, 7)
  );
}

export function getRandomInt(from, to) {
  return Math.floor(from + Math.random() * (to - from));
}

export function getRandomSign() {
  return 2 * Math.round(Math.random()) - 1;
}

export function brightnessByColor(color) {
  let r, g, b;
  const isHEX = color.indexOf("#") === 0;
  const isRGB = color.indexOf("rgb") === 0;
  if (isHEX) {
    const hasFullSpec = color.length === 7;
    const m = color.substring(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g);
    if (m) {
      r = parseInt(m[0] + (hasFullSpec ? "" : m[0]), 16);
      g = parseInt(m[1] + (hasFullSpec ? "" : m[1]), 16);
      b = parseInt(m[2] + (hasFullSpec ? "" : m[2]), 16);
    }
  } else if (isRGB) {
    const m = color.match(/(\d+){3}/g);
    if (m) {
      r = m[0];
      g = m[1];
      b = m[2];
    }
  }
  if (r) return (r * 299 + g * 587 + b * 114) / 1000;
}
