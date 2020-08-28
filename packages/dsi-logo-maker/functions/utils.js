import fontMetrics from "./fontmetrics";
import flags from "./flags";

// This function currently does not take kerning into account,
// since every letter is being computed individually
const glyphAdvanceWidth = (fontSize, char) => {
  const glyph = fontMetrics.glyphs[char];
  if (!glyph) {
    console.error("Char is not in fontmetrics:", char);
  }
  return (glyph.advanceWidth / fontMetrics.unitsPerEm) * fontSize;
};

export const splitContent = (fontSize, words, colors) => {
  const bricks = [];
  let colori = 0;
  words.forEach(word => {
    for (let i = 0; i < word.length; i++) {
      bricks.push({
        char: word[i],
        width: glyphAdvanceWidth(fontSize, word[i]),
        isWordFirst: i === 0,
        isWordLast: i === word.length - 1,
        color: colors[colori % colors.length]
      });
      if (i === word.length - 1) {
        colori++;
      }
    }
  });
  return bricks;
};

export function getRandomFlag() {
  return flags[Math.floor(Math.random() * flags.length)];
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

export const computeSpacing = (width, height, rows) => {
  const spacing = {};
  spacing.rowHeight = height / rows;
  spacing.fontSize = Math.round(spacing.rowHeight * 0.8);
  spacing.wordGap = width * 0.015;
  spacing.startGap = width * 0.015;
  spacing.endGap = width * 0.015;
  spacing.fontYOffset = spacing.rowHeight / 2 + spacing.fontSize * 0.37;
  return spacing;
};

export const computePadding = (width, rowBricks, spacing) => {
  const wordBreaks = rowBricks.filter((b, i) => b.isWordFirst && i !== 0).length;
  const charsWidth = rowBricks.reduce((a, b) => a + b.width, 0);
  const remain =
    width - spacing.startGap - spacing.endGap - charsWidth - wordBreaks * spacing.wordGap * 2;
  return remain / (rowBricks.length - 1) / 2;
};

export const computeBrickHorizontal = (x, brickIteration, spacing) => {
  const [brick, col, brickArray] = brickIteration;
  const { startGap, endGap, padding, wordGap } = spacing;
  const isRowFirst = col === 0;
  const isRowLast = col === brickArray.length - 1;

  let w, charX;
  if (isRowFirst) {
    w = startGap + brick.width + padding;
    charX = x + startGap;
  } else if (isRowLast) {
    w = padding + brick.width + endGap;
    charX = x + padding;
  } else {
    w = brick.width + padding * 2;
    charX = x + w / 2 - brick.width / 2;
  }
  if (brick.isWordFirst && !isRowFirst) {
    w += wordGap;
    charX += wordGap;
  } else if (brick.isWordLast && !isRowLast) {
    w += wordGap;
  }
  return { w, charX };
};
