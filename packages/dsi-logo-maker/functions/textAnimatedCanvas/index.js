import { getColors } from "../../utils/graphics";
import {
  computeBaseBricks,
  computeBlockGeometry,
  precomputeBlocks,
  getIndexModule
} from "../../utils/blocks";
import { loadOpentypeFont } from "../../utils/opentype";
import { drawBlock } from "../../utils/blocks-canvas";

export const handler = async ({ inputs, getCanvas, done, frame, drawLoop }) => {
  const {
    width,
    ratio,
    fontMode,
    text,
    columns: cols,
    rows,
    colors: colorsString,
    offset,
    duration,
    loops
  } = inputs;

  const words = text.split(" ").map(s => s.toUpperCase());
  const height = Math.floor((width / ratio) * rows);
  const font = await loadOpentypeFont(fontMode);

  const colors = getColors("Custom Colors", null, colorsString.split(","));
  const blockGeometry = computeBlockGeometry(width, height, rows, cols);
  const baseBricks = computeBaseBricks(words, blockGeometry.fontSize, font);

  const blocksByIndex = precomputeBlocks(blockGeometry, baseBricks);
  const position = { x: 0, y: 0 };

  const { ctx } = getCanvas(width, height);

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

  let internalOffset = 0;
  let progress = 0;

  drawLoop(frameCount => {
    let currentProgress = Math.floor(
      2 * loops * cols * (frameCount / duration)
    );

    if (currentProgress > progress) {
      progress = currentProgress;
      internalOffset = internalOffset + 1;
      draw();
    }
    if (frameCount < duration) {
      frame();
    } else {
      done();
    }
  });
};

export const inputs = {
  width: {
    type: "number",
    default: 500,
    min: 100
  },
  ratio: {
    type: "number",
    default: 9,
    max: 20,
    slider: true,
    min: 6,
    step: 1
  },
  fontMode: {
    type: "text",
    options: {
      "F Grotesk Thin": "FGroteskThin-Regular.otf",
      "F Grotesk": "FGrotesk-Regular.otf"
    },
    default: "F Grotesk Thin"
  },
  text: {
    type: "text",
    default: "Whatever you want"
  },
  columns: {
    type: "number",
    default: 13,
    min: 1,
    step: 1
  },
  rows: {
    type: "number",
    default: 2,
    min: 1,
    step: 1
  },
  colors: {
    type: "text",
    default: "#11457e,#d7141a,#f1f1f1"
  },
  offset: {
    type: "number",
    default: 0,
    min: 0,
    max: 1,
    step: 0.05,
    slider: true
  },
  duration: {
    type: "number",
    default: 600,
    min: 10,
    step: 10,
    label: "Duration in Frames"
  },
  loops: {
    type: "number",
    default: 4,
    min: 1
  }
};

export const presets = {
  bigger: {
    width: 500,
    ratio: 9
  },
  evenBigger: {
    width: 500,
    ratio: 9
  }
};

export const settings = {
  engine: require("@mechanic-design/engine-canvas"),
  animated: true
};
