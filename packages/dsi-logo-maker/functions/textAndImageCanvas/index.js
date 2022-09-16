import { getColors } from '../../utils/graphics';
import {
  computeBaseBricks,
  computeBlockGeometry,
  computeBlock,
} from '../../utils/blocks';
import { drawBlock } from '../../utils/blocks-canvas';

export const handler = ({ inputs, mechanic, getCanvas }) => {
  const {
    width,
    ratio,
    text,
    columns: cols,
    rows,
    colors: colorsString,
    offset,
    image,
  } = inputs;

  const words = text.split(' ').map((s) => s.toUpperCase());
  const colors = getColors('Custom Colors', null, colorsString.split(','));
  const height = Math.floor((width / ratio) * rows);

  const { ctx } = getCanvas({ height });

  const blockGeometry = computeBlockGeometry(width, height, rows, cols);
  const baseBricks = computeBaseBricks(words, blockGeometry.fontSize);

  const block = computeBlock(
    blockGeometry,
    baseBricks,
    Math.floor(offset * baseBricks.length)
  );
  const position = { x: image ? height : 0, y: 0 };

  ctx.save();
  ctx.clearRect(0, 0, blockGeometry.width, blockGeometry.height);
  drawBlock(ctx, { position, block, colors });
  ctx.restore();

  const img = new Image();
  img.onload = function () {
    ctx.drawImage(img, 0, 0, height, height);
    mechanic.done();
  };
  img.src = image ? URL.createObjectURL(image) : '';
  if (!image) {
    mechanic.done();
  }
};

export const inputs = {
  width: {
    type: 'number',
    default: 500,
    min: 100,
  },
  ratio: {
    type: 'number',
    default: 9,
    max: 20,
    slider: true,
    min: 6,
    step: 1,
  },
  text: {
    type: 'text',
    default: 'Whatever you want',
  },
  columns: {
    type: 'number',
    default: 13,
    min: 1,
    step: 1,
  },
  rows: {
    type: 'number',
    default: 2,
    min: 1,
    step: 1,
  },
  colors: {
    type: 'text',
    default: '#11457e,#d7141a,#f1f1f1',
  },
  offset: {
    type: 'number',
    default: 0,
    min: 0,
    max: 1,
    step: 0.05,
    slider: true,
  },
  image: {
    type: 'image',
    multiple: false,
  },
};

export const presets = {
  bigger: {
    width: 500,
    ratio: 9,
  },
};

export const settings = {
  engine: require('@mechanic-design/engine-canvas'),
};
