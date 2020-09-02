import engine from "mechanic-engine-canvas";
import { getRandomFlag } from "../logo-utils/graphics";
import { computeBaseBricks, computeBlockGeometry, precomputeBlocks } from "../logo-utils/blocks";
import { drawBlock } from "../logo-utils/blocks-canvas";

export const handler = (params, mechanic) => {
  const { width, height, logoWidth, logoRatio } = params;

  const rows = 2;
  const cols = 13;
  const logoHeight = Math.floor((logoWidth / logoRatio) * rows);
  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];

  let colors = getRandomFlag().colors;
  const blockGeometry = computeBlockGeometry(logoWidth, logoHeight, rows, cols);
  const baseBricks = computeBaseBricks(words, blockGeometry.fontSize);
  const blocksByIndex = precomputeBlocks(blockGeometry, baseBricks, baseBricks.length);

  const blockConfigs = [];
  let position = { x: 0, y: 0 };
  let offset = 0;
  let brickIndex = baseBricks.length - (offset % baseBricks.length);

  while (position.y < height) {
    const block = blocksByIndex[brickIndex % baseBricks.length];
    blockConfigs.push({ position, block, colors });
    position = { ...position };
    if (position.x + block.width < width) {
      position.x += block.width;
      offset++;
      brickIndex = baseBricks.length - (offset % baseBricks.length);
      colors = getRandomFlag().colors;
    } else {
      position.x = position.x - width;
      position.y += block.height;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  ctx.save();
  ctx.clearRect(0, 0, width, height);
  blockConfigs.forEach(blockConfig => drawBlock(ctx, blockConfig));
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