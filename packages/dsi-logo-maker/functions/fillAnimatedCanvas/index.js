import engine from "mechanic-engine-canvas";
import { getColors } from "../utils/graphics";
import { computeBaseBricks, computeBlockGeometry, precomputeBlocks } from "../utils/blocks";
import { drawBlock } from "../utils/blocks-canvas";

export const handler = (params, mechanic) => {
  const { width, height, logoWidth, logoRatio, duration } = params;

  const rows = 2;
  const cols = 13;
  const logoHeight = Math.floor((logoWidth / logoRatio) * rows);
  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];

  let colors = getColors("Random Flag");
  const blockGeometry = computeBlockGeometry(logoWidth, logoHeight, rows, cols);
  const baseBricks = computeBaseBricks(words, blockGeometry.fontSize);
  const blocksByIndex = precomputeBlocks(blockGeometry, baseBricks, baseBricks.length);

  const blockConfigs = [];
  let position = { x: 0, y: 0 };
  let offset = 0;
  let brickIndex = baseBricks.length - (offset % baseBricks.length);

  while (position.y < height) {
    const block = blocksByIndex[brickIndex % baseBricks.length];
    const animation = {
      loops: Math.floor(Math.random() * 4 + 1),
      progress: 0
    };
    blockConfigs.push({ position, block, colors, animation });
    position = { ...position };
    if (position.x + block.width < width) {
      position.x += block.width;
      colors = getColors("Random Flag");
      offset++;
      brickIndex = baseBricks.length - (offset % baseBricks.length);
    } else {
      position.x = position.x - width;
      position.y += block.height;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const draw = () => {
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    blockConfigs.forEach(blockConfig => drawBlock(ctx, blockConfig));
    ctx.restore();
  };

  const direction = -1;
  let starttime;

  const animationHandler = t => {
    const timestamp = t || new Date().getTime();
    if (!starttime) {
      starttime = timestamp;
    }
    const runtime = timestamp - starttime;
    let changed = false;
    blockConfigs.forEach(blockConfigs => {
      const { block, animation } = blockConfigs;
      const currentProgress = Math.floor(2 * animation.loops * block.cols * (runtime / duration));
      if (currentProgress > animation.progress) {
        animation.progress = currentProgress;
        changed = true;
        const index = block.brickIndex + 1 * direction;
        const brickIndex = ((index % baseBricks.length) + baseBricks.length) % baseBricks.length;
        const newBlock = blocksByIndex[brickIndex];
        blockConfigs.block = newBlock;
      }
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
