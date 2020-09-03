import engine from "mechanic-engine-canvas";
import { getColors } from "../utils/graphics";
import {
  computeBaseBricks,
  computeBlockGeometry,
  precomputeBlocks,
  getIndexModule
} from "../utils/blocks";
import { drawBlock } from "../utils/blocks-canvas";

export const handler = (params, mechanic) => {
  const {
    width,
    height,
    text,
    columns: cols,
    rows,
    colors: colorsString,
    offset,
    duration,
    loops
  } = params;

  const words = text.split(" ").map(s => s.toUpperCase());

  const colors = getColors("Custom Colors", null, colorsString);
  const blockGeometry = computeBlockGeometry(width, height, rows, cols);
  const baseBricks = computeBaseBricks(words, blockGeometry.fontSize);

  const blocksByIndex = precomputeBlocks(blockGeometry, baseBricks);
  const position = { x: 0, y: 0 };

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const draw = () => {
    const brickOffset = offset + internalOffset;
    const block = blocksByIndex[getIndexModule(brickOffset, blocksByIndex.length)];

    ctx.save();
    ctx.clearRect(0, 0, blockGeometry.width, blockGeometry.height);

    drawBlock(ctx, { position, block, colors });

    ctx.restore();
  };

  let starttime;
  let internalOffset = 0;
  let progress = 0;

  const animationHandler = t => {
    const timestamp = t || new Date().getTime();
    if (!starttime) {
      starttime = timestamp;
    }
    const runtime = timestamp - starttime;
    let currentProgress = Math.floor(2 * loops * cols * (runtime / duration));
    if (currentProgress > progress) {
      progress = currentProgress;
      internalOffset = internalOffset + 1;
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
  },
  duration: {
    type: "integer",
    default: 10000
  },
  loops: {
    type: "integer",
    default: 4
  }
};

export const settings = {
  engine,
  animated: true
};
