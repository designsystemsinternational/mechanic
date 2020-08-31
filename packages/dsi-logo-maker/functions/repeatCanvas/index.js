import engine from "mechanic-engine-canvas";
import { getRandomFlag, computeBlockGeometry, computeBaseBricks, computeBlock } from "../utils";
import { canvasDraw } from "../canvas-draw";

export const handler = (params, mechanic) => {
  const { width, height, logoWidth, logoRatio } = params;

  const rows = 2;
  const cols = 13;
  const logoHeight = Math.floor((logoWidth / logoRatio) * rows);
  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];

  const blocks = [];
  let blockGeometry = computeBlockGeometry(0, 0, logoWidth, logoHeight, rows, cols);
  let offset = 0;
  let colors = getRandomFlag().colors;
  let baseBricks = computeBaseBricks(words, colors, blockGeometry.fontSize);
  let brickIndex = baseBricks.length - (offset % baseBricks.length);
  while (blockGeometry.yOffset < height) {
    const block = computeBlock(blockGeometry, baseBricks, brickIndex);
    blocks.push(block);
    if (blockGeometry.xOffset + blockGeometry.width < width) {
      blockGeometry.xOffset += blockGeometry.width;
      colors = getRandomFlag().colors;
      baseBricks = computeBaseBricks(words, colors, blockGeometry.fontSize);
      offset++;
      brickIndex = baseBricks.length - (offset % baseBricks.length);
    } else {
      blockGeometry.xOffset = blockGeometry.xOffset - width;
      blockGeometry.yOffset += blockGeometry.height;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  ctx.save();
  ctx.clearRect(0, 0, width, height);
  blocks.forEach(block => canvasDraw(ctx, block));
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
