import flags from "./flags";

export function getColors(colorMode, flag, colorArray) {
  if (colorMode === "Custom Colors") {
    return colorArray.map(genColorObject);
  } else if (colorMode === "Pick Flag") {
    let f = getFlag(flag);
    return f.colors;
  } else {
    return getRandomFlag().colors;
  }
}

export function getRandomFlag() {
  return flags[Math.floor(Math.random() * flags.length)];
}

export const flagNames = flags.map(({ name }) => name);

export function getFlag(name) {
  for (const flag of flags) {
    if (name === flag.name) {
      return flag;
    }
  }
}

function textContrastColor(bgColor) {
  let color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB
  const uicolors = [r / 255, g / 255, b / 255];
  const c = uicolors.map(col => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  const l = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return l > 0.179 ? "black" : "white";
}

export function genColorObject(color) {
  return {
    background: color,
    blackOrWhite: textContrastColor(color)
  };
}
