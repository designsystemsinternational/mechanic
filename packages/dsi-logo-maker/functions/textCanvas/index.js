import { getColors } from "../utils/graphics";
import { computeBaseBricks, computeBlockGeometry, computeBlock } from "../utils/blocks";
import { drawBlock } from "../utils/blocks-canvas";

export const handler = (params, mechanic) => {
  const { width, height, text, columns: cols, rows, colors: colorsString, offset } = params;

  const words = text.split(" ").map(s => s.toUpperCase());

  const colors = getColors("Custom Colors", null, colorsString);
  const blockGeometry = computeBlockGeometry(width, height, rows, cols);
  const baseBricks = computeBaseBricks(words, blockGeometry.fontSize);

  const block = computeBlock(blockGeometry, baseBricks, offset);
  const position = { x: 0, y: 0 };

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  ctx.save();
  ctx.clearRect(0, 0, blockGeometry.width, blockGeometry.height);
  drawBlock(ctx, { position, block, colors });
  ctx.restore();
  mechanic.done(canvas);
};

export const params = {
  width: {
    type: "number",
    default: 500
  },
  height: {
    type: "number",
    default: 111
  },
  text: {
    type: "text",
    default: "Whatever you want"
  },
  columns: {
    type: "number",
    default: 13
  },
  rows: {
    type: "number",
    default: 2
  },
  colors: {
    type: "text",
    default: "#11457e,#d7141a,#f1f1f1"
  },
  offset: {
    type: "number",
    default: 0
  }
};

export const presets = {
  bigger: {
    width: 500,
    height: 222
  },
  biggerr: {
    width: 500,
    height: 333
  }
};

export const settings = {
  engine: require("mechanic-engine-canvas").run,
  usesRandom: true
};
