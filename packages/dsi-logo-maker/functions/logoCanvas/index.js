import { getColors, flagNames } from "../utils/graphics";
import { computeBaseBricks, computeBlockGeometry, computeBlock } from "../utils/blocks";
import { drawBlock } from "../utils/blocks-canvas";

export const handler = (params, mechanic) => {
  const { width, height, colorMode, flag, colors: colorsString, offset } = params;

  const rows = 2;
  const cols = 13;
  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];

  const colors = getColors(colorMode, flag, colorsString);
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
  colorMode: {
    type: "text",
    options: ["Random Flag", "Pick Flag", "Custom Colors"],
    default: "Random Flag"
  },
  flag: {
    type: "text",
    options: flagNames,
    default: flagNames[0]
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
    width: 1000,
    height: 222
  },
  biggerr: {
    width: 1500,
    height: 333
  }
};

export const settings = {
  engine: require("mechanic-engine-canvas").run,
  usesRandom: true
};
