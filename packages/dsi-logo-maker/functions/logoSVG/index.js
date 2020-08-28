import React, { useEffect } from "react";
import engine from "mechanic-engine-react";
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

export const handler = ({ width, height, done, colorMode, flag, colors: colorsString, offset }) => {
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
  let brickIndex = bricks.length - (offset % bricks.length);

  const svgBricks = [];

  for (let row = 0; row < rows; row++) {
    // calc in advance
    const rowBricks = [];
    for (let i = brickIndex; i < brickIndex + cols; i++) {
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

      svgBricks.push(
        <g key={svgBricks.length} transform={`translate(${x} ${y})`}>
          <rect
            fill={brick.color.background}
            width={w}
            height={spacing.rowHeight}
            strokeWidth="1"
            stroke={brick.color.background}></rect>
          <text
            fill={brick.color.blackOrWhite}
            fontSize={spacing.fontSize}
            fontFamily={`F, Helvetica, Sans-Serif`}
            x={charX - x}
            y={charY - y}>
            {brick.char}
          </text>
        </g>
      );
      x += w;
      brickIndex++;
    });
  }

  useEffect(() => {
    done();
  }, []);

  return (
    <svg width={width} height={height}>
      {svgBricks}
    </svg>
  );
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
  }
};

export const settings = {
  engine
};
