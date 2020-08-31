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

export const computeBaseBricks = (words, colors, fontSize) => {
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

export const computeBlockGeometry = (xOffset, yOffset, width, height, rows, cols) => {
  const geometry = { xOffset, yOffset, width, height, numberRows: rows, cols };
  geometry.rowHeight = height / rows;
  geometry.fontSize = Math.round(geometry.rowHeight * 0.8);
  geometry.wordGap = width * 0.015;
  geometry.startGap = width * 0.015;
  geometry.endGap = width * 0.015;
  geometry.fontYOffset = geometry.rowHeight / 2 + geometry.fontSize * 0.37;
  return geometry;
};

export const computeBlock = (blockGeometry, baseBricks, brickIndex) => {
  // console.log(blockGeometry);
  // console.log(baseBricks);
  // console.log(brickIndex);
  const block = { ...blockGeometry, baseBricks, brickIndex, rows: [] };

  for (let rowIndex = 0; rowIndex < block.numberRows; rowIndex++) {
    const rowBricks = computeRowBricks(baseBricks, brickIndex, block.cols);
    const rowGeometry = computeRowGeometry(rowBricks, rowIndex, block);
    const row = computeRow(rowBricks, rowGeometry, block);
    brickIndex += row.bricks.length;
    block.rows.push(row);
  }
  return block;
};

const computeRowBricks = (baseBricks, brickIndex, cols) => {
  const rowBricks = [];
  for (let i = brickIndex; i < brickIndex + cols; i++) {
    rowBricks.push(baseBricks[i % baseBricks.length]);
  }
  return rowBricks;
};

const computeRowGeometry = (bricks, rowIndex, blockGeometry) => {
  const wordBreaks = bricks.filter((b, i) => b.isWordFirst && i !== 0).length;
  const charsWidth = bricks.reduce((a, b) => a + b.width, 0);
  const { width, startGap, endGap, wordGap } = blockGeometry;
  const remain = width - startGap - endGap - charsWidth - wordBreaks * wordGap * 2;
  return {
    rowIndex,
    padding: remain / (bricks.length - 1) / 2
  };
};

const computeRow = (rowBricks, rowGeometry, blockGeometry) => {
  const row = { ...rowGeometry, bricks: [] };
  let currentX = 0;
  rowBricks.forEach((baseBrick, col) => {
    const { w, charX } = computeBrickGeometry(baseBrick, col, row, blockGeometry);
    const brick = { ...baseBrick, x: currentX, w, charX };
    currentX += w;
    row.bricks.push(brick);
  });
  return row;
};

const computeBrickGeometry = (brick, col, rowGeometry, blockGeometry) => {
  const { cols, startGap, endGap, wordGap } = blockGeometry;
  const { padding } = rowGeometry;

  const isRowFirst = col === 0;
  const isRowLast = col === cols - 1;

  let w, charX;
  if (isRowFirst) {
    w = startGap + brick.width + padding;
    charX = startGap;
  } else if (isRowLast) {
    w = padding + brick.width + endGap;
    charX = padding;
  } else {
    w = brick.width + padding * 2;
    charX = w / 2 - brick.width / 2;
  }
  if (brick.isWordFirst && !isRowFirst) {
    w += wordGap;
    charX += wordGap;
  } else if (brick.isWordLast && !isRowLast) {
    w += wordGap;
  }

  return { w, charX };
};
