export const computeBaseBricks = (words, fontSize, font) => {
  const bricks = [];
  let colori = 0;
  words.forEach((word) => {
    for (let i = 0; i < word.length; i++) {
      const glyph = font.charToGlyph(word[i]);
      bricks.push({
        char: word[i],
        glyph: glyph,
        width: (glyph.advanceWidth / font.unitsPerEm) * fontSize,
        isWordFirst: i === 0,
        isWordLast: i === word.length - 1,
        color: colori,
      });
      if (i === word.length - 1) {
        colori++;
      }
    }
  });
  return bricks;
};

export const getIndexModule = (index, module) => {
  return ((index % module) + module) % module;
};

export const precomputeBlocks = (blockGeometry, baseBricks) => {
  const blocksByIndex = [];
  for (let i = 0; i < baseBricks.length; i++) {
    blocksByIndex.push(computeBlock(blockGeometry, baseBricks, i));
  }
  return blocksByIndex;
};

export const computeBlockGeometry = (width, height, rows, cols) => {
  const geometry = { width, height, numberRows: rows, cols };
  geometry.rowHeight = height / rows;
  geometry.fontSize = Math.round(geometry.rowHeight * 0.8);
  geometry.wordGap = width * 0.015;
  geometry.startGap = width * 0.015;
  geometry.endGap = width * 0.015;
  geometry.fontYOffset = geometry.rowHeight / 2 + geometry.fontSize * 0.37;
  return geometry;
};

export const computeBlock = (blockGeometry, baseBricks, brickOffset) => {
  const block = {
    ...blockGeometry,
    brickIndex: getIndexModule(brickOffset, baseBricks.length),
    rows: [],
  };

  for (let rowIndex = 0; rowIndex < block.numberRows; rowIndex++) {
    const rowBricks = computeRowBricks(baseBricks, brickOffset, block.cols);
    const rowGeometry = computeRowGeometry(rowBricks, rowIndex, block);
    const row = computeRow(rowBricks, rowGeometry, block);
    brickOffset += row.bricks.length;
    block.rows.push(row);
  }
  return block;
};

const computeRowBricks = (baseBricks, brickOffset, cols) => {
  const rowBricks = [];
  for (let i = brickOffset; i < brickOffset + cols; i++) {
    const index = getIndexModule(i, baseBricks.length);
    rowBricks.push(baseBricks[index]);
  }
  return rowBricks;
};

const computeRowGeometry = (bricks, rowIndex, blockGeometry) => {
  const wordBreaks = bricks.filter((b, i) => b.isWordFirst && i !== 0).length;
  const charsWidth = bricks.reduce((a, b) => a + b.width, 0);
  const { width, startGap, endGap, wordGap } = blockGeometry;
  const remain =
    width - startGap - endGap - charsWidth - wordBreaks * wordGap * 2;
  return {
    rowIndex,
    padding: remain / (bricks.length - 1) / 2,
  };
};

const computeRow = (rowBricks, rowGeometry, blockGeometry) => {
  const row = { ...rowGeometry, bricks: [] };
  let currentX = 0;
  rowBricks.forEach((baseBrick, col) => {
    const { w, charX } = computeBrickGeometry(
      baseBrick,
      col,
      row,
      blockGeometry
    );
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
