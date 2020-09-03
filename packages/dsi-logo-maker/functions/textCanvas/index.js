import engine from "mechanic-engine-canvas";
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
  size: {
    default: {
      width: 500,
      height: 111
    },
    bigger: {
      width: 500,
      height: 222
    },
    biggerr: {
      width: 500,
      height: 333
    }
  },
  text: {
    type: "string",
    default: "Whatever you want"
  },
  columns: {
    type: "integer",
    default: 13
  },
  rows: {
    type: "integer",
    default: 2
  },
  colors: {
    type: "string",
    default: "#11457e,#d7141a,#f1f1f1"
  },
  offset: {
    type: "integer",
    default: 0
  }
};

export const settings = {
  engine
};
