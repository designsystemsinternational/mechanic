import engine from "mechanic-engine-canvas";
import {
  splitContent,
  getRandomFlag,
  computeSpacing,
  computePadding,
  computeBrickHorizontal
} from "../utils";

export const handler = (params, mechanic) => {
  const { width, height, logoWidth, logoRatio } = params;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const rows = 2;
  const cols = 13;
  const logoHeight = Math.floor((logoWidth / logoRatio) * rows);
  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];

  const spacing = computeSpacing(logoWidth, logoHeight, rows);

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  let offset = 0;
  let colors = getRandomFlag().colors;
  let bricks = splitContent(spacing.fontSize, words, colors);
  let brickIndex = bricks.length - (offset % bricks.length);
  let logoXOffset = 0;
  let logoYOffset = 0;
  while (logoYOffset < height) {
    for (let row = 0; row < rows; row++) {
      // calc in advance
      const rowBricks = [];
      for (let i = brickIndex; i < brickIndex + cols; i++) {
        rowBricks.push(bricks[i % bricks.length]);
      }
      spacing.padding = computePadding(logoWidth, rowBricks, spacing);

      // then loop through the row and create the spacing as needed.
      let x = logoXOffset;
      const y = logoYOffset + row * spacing.rowHeight;
      const charY = y + spacing.fontYOffset;

      rowBricks.forEach((...brickIteration) => {
        const { w, charX } = computeBrickHorizontal(x, brickIteration, spacing);
        const brick = brickIteration[0];

        ctx.fillStyle = brick.color.background;
        ctx.strokeStyle = brick.color.background;
        ctx.fillRect(x, y, w, spacing.rowHeight);
        ctx.strokeRect(x, y, w, spacing.rowHeight);
        ctx.fillStyle = brick.color.blackOrWhite;
        ctx.font = `${spacing.fontSize}px F, Helvetica, Sans-Serif`;
        ctx.fillText(brick.char, charX, charY);

        x += w;
        brickIndex++;
      });
    }
    if (logoXOffset + logoWidth < width) {
      logoXOffset += logoWidth;
      colors = getRandomFlag().colors;
      bricks = splitContent(spacing.fontSize, words, colors);
      offset++;
      brickIndex = bricks.length - (offset % bricks.length);
    } else {
      logoXOffset = logoXOffset - width;
      logoYOffset += logoHeight;
    }
  }
  ctx.restore();
  mechanic.done(canvas);
};

export const params = {
  size: {
    default: {
      width: 300,
      height: 300
    },
    bigger: {
      width: 1000,
      height: 1000
    },
    panoramic: {
      width: 1000,
      height: 250
    },
    long: {
      width: 500,
      height: 1000
    }
  },
  logoWidth: {
    type: "integer",
    default: 80
  },
  logoRatio: {
    type: "integer",
    default: 9
  }
};

export const settings = {
  engine
};
