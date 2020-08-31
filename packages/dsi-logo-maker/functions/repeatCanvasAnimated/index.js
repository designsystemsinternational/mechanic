import engine from "mechanic-engine-canvas";
import { getRandomFlag, computeBlockGeometry, computeBaseBricks, computeBlock } from "../utils";
import { canvasDraw } from "../canvas-draw";

export const handler = (params, mechanic) => {
  const { width, height, logoWidth, logoRatio, duration } = params;

  const rows = 2;
  const cols = 13;
  const logoHeight = Math.floor((logoWidth / logoRatio) * rows);
  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];

  let blocks = [];
  let blockGeometry = computeBlockGeometry(0, 0, logoWidth, logoHeight, rows, cols);
  let offset = 0;
  let colors = getRandomFlag().colors;
  let baseBricks = computeBaseBricks(words, colors, blockGeometry.fontSize);
  let brickIndex = baseBricks.length - (offset % baseBricks.length);
  while (blockGeometry.yOffset < height) {
    const block = computeBlock(blockGeometry, baseBricks, brickIndex);
    block.loops = Math.floor(Math.random() * 4 + 1);
    block.progress = 0;
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

  const draw = () => {
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    blocks.forEach(block => canvasDraw(ctx, block));
    ctx.restore();
  };

  const direction = -1;
  let starttime;

  const animationHandler = t => {
    const timestamp = timestamp || new Date().getTime();
    if (!starttime) {
      starttime = timestamp;
    }
    const runtime = timestamp - starttime;
    let changed = false;
    blocks = blocks.map(block => {
      const currentProgress = Math.floor(2 * block.loops * block.cols * (runtime / duration));
      if (currentProgress > block.progress) {
        block.progress = currentProgress;
        changed = true;
        const index = block.brickIndex + 1 * direction;
        return computeBlock(
          block,
          block.baseBricks,
          index > -1 ? index : index + block.baseBricks.length
        );
      }
      return block;
    });
    if (changed) {
      draw();
    }
    if (runtime < duration) {
      mechanic.frame(canvas);
      requestAnimationFrame(animationHandler);
    } else {
      mechanic.done(canvas);
    }
  };

  requestAnimationFrame(animationHandler);
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
  },
  duration: {
    type: "integer",
    default: 5000
  }
};

export const settings = {
  engine,
  animated: true
};
