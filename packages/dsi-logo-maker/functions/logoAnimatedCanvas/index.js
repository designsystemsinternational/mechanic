import { getColors, flagNames } from '../../utils/graphics';
import {
  computeBaseBricks,
  computeBlockGeometry,
  precomputeBlocks,
  getIndexModule,
} from '../../utils/blocks';
import { loadOpentypeFont } from '../../utils/opentype';
import { drawBlock } from '../../utils/blocks-canvas';

export const handler = async ({ inputs, mechanic, frameCount }) => {
  const {
    width,
    ratio,
    fontMode,
    colorMode,
    flag,
    firstColor,
    secondColor,
    thirdColor,
    offset,
    durationInMs,
    loops,
  } = inputs;

  const duration = (durationInMs / 1000) * mechanic.fps;
  const rows = 2;
  const cols = 13;
  const words = ['DESIGN', 'SYSTEMS', 'INTERNATIONAL'];
  const height = Math.floor((width / ratio) * rows);
  const font = await mechanic.memo(
    async () => await loadOpentypeFont(fontMode),
    [fontMode]
  );

  // It's a bit annoying you need to memoize all random values when using the
  // controlled animation loop. Starting to feel like the custom animation loop
  // is the better option.
  const colors = mechanic.memo(
    () => getColors(colorMode, flag, [firstColor, secondColor, thirdColor]),
    [colorMode, flag, firstColor, secondColor, thirdColor]
  );

  const blockGeometry = computeBlockGeometry(width, height, rows, cols);
  const baseBricks = computeBaseBricks(words, blockGeometry.fontSize, font);
  const blocksByIndex = precomputeBlocks(blockGeometry, baseBricks);
  const position = { x: 0, y: 0 };

  const { canvas, ctx } = mechanic.getCanvas({ height });

  const internalOffset = Math.floor(2 * loops * cols * (frameCount / duration));

  const brickOffset =
    Math.floor(offset * blocksByIndex.length) + internalOffset;
  const block =
    blocksByIndex[getIndexModule(brickOffset, blocksByIndex.length)];

  ctx.save();
  ctx.clearRect(0, 0, blockGeometry.width, blockGeometry.height);

  drawBlock(ctx, { position, block, colors });

  ctx.restore();

  if (frameCount >= duration) {
    mechanic.done();
  }

  return canvas;
};

export const inputs = {
  width: {
    type: 'number',
    default: 500,
  },
  ratio: {
    type: 'number',
    default: 9,
    max: 20,
    slider: true,
    min: 6,
    step: 1,
  },
  fontMode: {
    type: 'text',
    options: {
      'F Grotesk Thin': 'FGroteskThin-Regular.otf',
      'F Grotesk': 'FGrotesk-Regular.otf',
    },
    default: 'F Grotesk Thin',
  },
  colorMode: {
    type: 'text',
    options: ['Random Flag', 'Pick Flag', 'Custom Colors'],
    default: 'Random Flag',
  },
  flag: {
    type: 'text',
    options: flagNames,
    default: flagNames[0],
    editable: (inputs) => inputs.colorMode === 'Pick Flag',
  },
  firstColor: {
    type: 'color',
    model: 'hex',
    default: '#11457e',
    editable: (inputs) => inputs.colorMode === 'Custom Colors',
  },
  secondColor: {
    type: 'color',
    model: 'hex',
    default: '#d7141a',
    editable: (inputs) => inputs.colorMode === 'Custom Colors',
  },
  thirdColor: {
    type: 'color',
    model: 'hex',
    default: '#f1f1f1',
    editable: (inputs) => inputs.colorMode === 'Custom Colors',
  },
  offset: {
    type: 'number',
    default: 0,
    min: 0,
    max: 1,
    step: 0.05,
    slider: true,
  },
  durationInMs: {
    type: 'number',
    default: 5000,
    step: 500,
    min: 1000,
  },
  loops: {
    type: 'number',
    default: 4,
    min: 1,
    step: 1,
  },
};

export const presets = {
  bigger: {
    width: 1000,
    ratio: 9,
  },
  biggerr: {
    width: 1500,
    ratio: 9,
  },
};

export const settings = {
  engine: require('@mechanic-design/engine-canvas'),
  mode: 'animation',
  frameRate: 30,
};
