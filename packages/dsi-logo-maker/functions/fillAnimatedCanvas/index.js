import { getColors } from '../../utils/graphics';
import {
  computeBaseBricks,
  computeBlockGeometry,
  precomputeBlocks,
  getIndexModule,
} from '../../utils/blocks';
import { drawBlock } from '../../utils/blocks-canvas';

export const handler = ({ inputs, mechanic, getCanvas }) => {
  const { width, height, logoWidth, logoRatio, duration } = inputs;

  const { canvas, ctx } = getCanvas();

  const rows = 2;
  const cols = 13;
  const logoHeight = Math.floor((logoWidth / logoRatio) * rows);
  const words = ['DESIGN', 'SYSTEMS', 'INTERNATIONAL'];

  let colors = getColors('Random Flag');
  const blockGeometry = computeBlockGeometry(logoWidth, logoHeight, rows, cols);
  const baseBricks = computeBaseBricks(words, blockGeometry.fontSize);
  const blocksByIndex = precomputeBlocks(blockGeometry, baseBricks);

  const blockConfigs = [];
  let position = { x: 0, y: 0 };
  let brickOffset = 0;

  while (position.y < height) {
    const block =
      blocksByIndex[getIndexModule(brickOffset, blocksByIndex.length)];
    const animation = {
      loops: Math.floor(Math.random() * 4 + 1),
      progress: 0,
    };
    blockConfigs.push({ position, block, colors, animation });
    position = { ...position };
    if (position.x + block.width < width) {
      position.x += block.width;
      colors = getColors('Random Flag');
      brickOffset++;
    } else {
      position.x = position.x - width;
      position.y += block.height;
    }
  }

  const draw = () => {
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    blockConfigs.forEach((blockConfig) => drawBlock(ctx, blockConfig));
    ctx.restore();
  };

  let starttime;

  const animationHandler = (t) => {
    const timestamp = t || new Date().getTime();
    if (!starttime) {
      starttime = timestamp;
    }
    const runtime = timestamp - starttime;
    let changed = false;
    blockConfigs.forEach((blockConfigs) => {
      const { block, animation } = blockConfigs;
      const currentProgress = Math.floor(
        2 * animation.loops * block.cols * (runtime / duration)
      );
      if (currentProgress > animation.progress) {
        animation.progress = currentProgress;
        changed = true;
        const brickIndex = getIndexModule(
          block.brickIndex + 1,
          blocksByIndex.length
        );
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

export const inputs = {
  width: {
    type: 'number',
    default: 300,
    min: 100,
  },
  height: {
    type: 'number',
    default: 300,
    min: 100,
  },
  logoWidth: {
    type: 'number',
    default: 80,
    min: 10,
  },
  logoRatio: {
    type: 'number',
    default: 9,
    max: 20,
    slider: true,
    min: 6,
    step: 1,
  },
  duration: {
    type: 'number',
    default: 5000,
    step: 500,
    min: 1000,
  },
};

export const presets = {
  bigger: {
    width: 1000,
    height: 1000,
  },
  panoramic: {
    width: 1000,
    height: 250,
  },
  long: {
    width: 500,
    height: 1000,
  },
};

export const settings = {
  engine: require('@mechanic-design/engine-canvas'),
  animated: true,
};
