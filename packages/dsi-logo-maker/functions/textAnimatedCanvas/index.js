import { getColors } from "../../utils/graphics";
import {
  computeBaseBricks,
  computeBlockGeometry,
  precomputeBlocks,
  getIndexModule,
} from "../../utils/blocks";
import { drawBlock } from "../../utils/blocks-canvas";

export const handler = (params, mechanic) => {
  const {
    width,
    ratio,
    text,
    columns: cols,
    rows,
    colors: colorsString,
    offset,
    duration,
    loops,
  } = params;

  const words = text.split(" ").map((s) => s.toUpperCase());
  const height = Math.floor((width / ratio) * rows);

  const colors = getColors("Custom Colors", null, colorsString.split(","));
  const blockGeometry = computeBlockGeometry(width, height, rows, cols);
  const baseBricks = computeBaseBricks(words, blockGeometry.fontSize);

  const blocksByIndex = precomputeBlocks(blockGeometry, baseBricks);
  const position = { x: 0, y: 0 };

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const draw = () => {
    const brickOffset =
      Math.floor(offset * blocksByIndex.length) + internalOffset;
    const block =
      blocksByIndex[getIndexModule(brickOffset, blocksByIndex.length)];

    ctx.save();
    ctx.clearRect(0, 0, blockGeometry.width, blockGeometry.height);

    drawBlock(ctx, { position, block, colors });

    ctx.restore();
  };

  let starttime;
  let internalOffset = 0;
  let progress = 0;

  const animationHandler = (t) => {
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
  width: {
    type: "number",
    default: 500,
    min: 100,
  },
  ratio: {
    type: "number",
    default: 9,
    max: 20,
    slider: true,
    min: 6,
    step: 1,
  },
  text: {
    type: "text",
    default: "Whatever you want",
  },
  columns: {
    type: "number",
    default: 13,
    min: 1,
    step: 1,
  },
  rows: {
    type: "number",
    default: 2,
    min: 1,
    step: 1,
  },
  colors: {
    type: "text",
    default: "#11457e,#d7141a,#f1f1f1",
  },
  offset: {
    type: "number",
    default: 0,
    min: 0,
    max: 1,
    step: 0.05,
    slider: true,
  },
  duration: {
    type: "number",
    default: 10000,
    min: 1000,
    step: 500,
  },
  loops: {
    type: "number",
    default: 4,
    min: 1,
  },
};

export const presets = {
  bigger: {
    width: 500,
    ratio: 9,
  },
  evenBigger: {
    width: 500,
    ratio: 9,
  },
};

export const settings = {
  engine: require("@designsystemsinternational/mechanic-engine-canvas"),
  animated: true,
};
