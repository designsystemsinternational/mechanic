import { getColors } from '../../utils/graphics';
import {
  computeBaseBricks,
  computeBlockGeometry,
  precomputeBlocks,
  getIndexModule,
} from '../../utils/blocks';
import { loadOpentypeFont } from '../../utils/opentype';
import { drawBlock } from '../../utils/blocks-canvas';

export const handler = async ({ inputs, mechanic }) => {
  const { width, height, logoWidth, logoRatio, durationInMs, fontMode } =
    inputs;

  const duration = (durationInMs / 1000) * mechanic.fps;

  const rows = 2;
  const cols = 13;
  const logoHeight = Math.floor((logoWidth / logoRatio) * rows);
  const words = ['DESIGN', 'SYSTEMS', 'INTERNATIONAL'];
  const font = await loadOpentypeFont(fontMode);

  let colors = getColors('Random Flag');
  const blockGeometry = computeBlockGeometry(logoWidth, logoHeight, rows, cols);
  const baseBricks = computeBaseBricks(words, blockGeometry.fontSize, font);
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

  const { canvas, ctx } = mechanic.getCanvas();

  mechanic.draw(({ frameCount }) => {
    let changed = false;
    blockConfigs.forEach((blockConfigs) => {
      const { block, animation } = blockConfigs;
      const currentProgress = Math.floor(
        2 * animation.loops * block.cols * (frameCount / duration)
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
      ctx.save();
      ctx.clearRect(0, 0, width, height);
      blockConfigs.forEach((blockConfig) => drawBlock(ctx, blockConfig));
      ctx.restore();
    }

    if (frameCount >= duration) {
      mechanic.done();
    }

    mechanic.frame(canvas);
  });
};

export const inputs = {
  width: {
    type: 'number',
    default: 500,
    min: 100,
  },
  height: {
    type: 'number',
    default: 500,
    min: 100,
  },
  logoWidth: {
    type: 'number',
    default: 300,
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
  durationInMs: {
    type: 'number',
    default: 5000,
    step: 500,
    min: 1000,
  },
  fontMode: {
    type: 'text',
    options: {
      'F Grotesk Thin': 'FGroteskThin-Regular.otf',
      'F Grotesk': 'FGrotesk-Regular.otf',
    },
    default: 'F Grotesk Thin',
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
  mode: 'animation-custom',
  fps: 60,
};
