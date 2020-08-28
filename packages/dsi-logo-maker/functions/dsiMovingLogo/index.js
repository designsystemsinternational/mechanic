import engine from "mechanic-engine-canvas";
import {
  splitContent,
  getRandomFlag,
  flagNames,
  getFlag,
  genColorObject,
  computeSpacing,
  computePadding,
  computeBrickHorizontal
} from "../utils";

export const handler = (params, mechanic) => {
  const { width, height, colorMode, flag, colors: colorsString, offset, duration, loops } = params;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const rows = 2;
  const cols = 13;
  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];
  let colors;
  if (colorMode === "Custom Colors") {
    colors = colorsString.split(",").map(genColorObject);
  } else if (colorMode === "Pick Flag") {
    let f = getFlag(flag);
    colors = f.colors;
  } else {
    colors = getRandomFlag().colors;
  }

  const spacing = computeSpacing(width, height, rows);
  const bricks = splitContent(spacing.fontSize, words, colors);

  const draw = () => {
    const totalOffset = offset + internalOffset;
    let bricki = bricks.length - (totalOffset % bricks.length);

    ctx.save();
    ctx.clearRect(0, 0, width, height);
    for (let row = 0; row < rows; row++) {
      // calc in advance
      const rowBricks = [];
      for (let i = bricki; i < bricki + cols; i++) {
        rowBricks.push(bricks[i % bricks.length]);
      }
      spacing.padding = computePadding(width, rowBricks, spacing);

      // then loop through the row and create the spacing as needed.
      let x = 0;
      const y = row * spacing.rowHeight;
      const charY = y + spacing.fontYOffset;

      rowBricks.forEach((...brickIteration) => {
        const { w, charX } = computeBrickHorizontal(x, brickIteration, spacing);
        const brick = brickIteration[0];

        ctx.fillStyle = brick.color.background;
        ctx.strokeStyle = brick.color.background;
        ctx.fillRect(x, y, w, spacing.rowHeight);
        ctx.strokeRect(x, y, w, spacing.rowHeight);
        ctx.fillStyle = brick.color.blackOrWhite;
        ctx.font = `${spacing.fontSize}px F, Helvetica, Sans-Serif`;
        ctx.fillText(brick.char, charX, charY);

        x += w;
        bricki++;
      });
    }
    ctx.restore();
  };

  const direction = -1;
  let starttime;
  let internalOffset = 0;
  let progress = 0;

  const animationHandler = t => {
    const timestamp = timestamp || new Date().getTime();
    if (!starttime) {
      starttime = timestamp;
    }
    const runtime = timestamp - starttime;
    let currentProgress = Math.floor(2 * loops * cols * (runtime / duration));
    if (currentProgress > progress) {
      progress = currentProgress;
      internalOffset = internalOffset + 1 * direction;
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
      width: 1000,
      height: 222
    },
    biggerr: {
      width: 1500,
      height: 333
    }
  },
  colorMode: {
    type: "string",
    choices: ["Random Flag", "Pick Flag", "Custom Colors"],
    default: "randomFlag"
  },
  flag: {
    type: "string",
    choices: flagNames,
    default: flagNames[0]
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
