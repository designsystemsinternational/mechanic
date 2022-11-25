import React, { useState, useEffect, useRef } from "react";
import { getColors } from "../../utils/graphics";
import {
  computeBaseBricks,
  computeBlockGeometry,
  precomputeBlocks,
  getIndexModule
} from "../../utils/blocks";
import { useLoadedOpentypeFont } from "../../utils/hooks";
import { Block } from "../../utils/blocks-components";

export const handler = ({ inputs, mechanic }) => {
  const { width, height, allSameColors, fontMode } = inputs;
  const { done } = mechanic;

  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];
  const blockConfigs = [];
  let colors = getColors("Random Flag");
  const font = useLoadedOpentypeFont(fontMode);

  useEffect(() => {
    if (font) {
      done();
    }
  }, [font]);

  if (!font) {
    return null;
  }

  const blockParams = [
    { rows: 6, cols: 5, logoRatio: 5, logoWidth: 150, x: 0, y: 0, offset: 0 },
    {
      rows: 2,
      cols: 13,
      logoRatio: 9,
      logoWidth: 150,
      x: 150,
      y: 0,
      offset: 5
    },
    {
      rows: 6,
      cols: 4,
      logoRatio: 4.25,
      logoWidth: 100,
      x: 150,
      y: 34,
      offset: 10
    },
    {
      rows: 21,
      cols: 10,
      logoRatio: 9,
      logoWidth: 50,
      x: 250,
      y: 34,
      offset: 5
    },
    {
      rows: 27,
      cols: 10,
      logoRatio: 9,
      logoWidth: 50,
      x: 250,
      y: 150,
      offset: 0
    },
    {
      rows: 2,
      cols: 13,
      logoRatio: 9,
      logoWidth: 250,
      x: 0,
      y: 175,
      offset: 4
    },
    {
      rows: 4,
      cols: 10,
      logoRatio: 9,
      logoWidth: 175,
      x: 75,
      y: 230,
      offset: 5
    },
    { rows: 3, cols: 5, logoRatio: 3, logoWidth: 75, x: 0, y: 230, offset: 0 }
  ];

  for (const param of blockParams) {
    if (!allSameColors) {
      colors = getColors("Random Flag");
    }
    const { rows, cols, logoRatio, logoWidth, x, y, offset } = param;

    let logoHeight = Math.floor((logoWidth / logoRatio) * rows);

    let blockGeometry = computeBlockGeometry(logoWidth, logoHeight, rows, cols);
    let baseBricks = computeBaseBricks(words, blockGeometry.fontSize, font);
    let blocksByIndex = precomputeBlocks(blockGeometry, baseBricks);

    let position = { x, y };
    let brickOffset = offset;

    let block =
      blocksByIndex[getIndexModule(brickOffset, blocksByIndex.length)];
    blockConfigs.push({ position, block, colors });
  }

  return (
    <svg width={width} height={height}>
      {blockConfigs.map(({ position, block, colors }) => (
        <Block
          key={`${position.x}-${position.y}`}
          position={position}
          block={block}
          colors={colors}
        ></Block>
      ))}
    </svg>
  );
};

export const inputs = {
  width: {
    type: "number",
    default: 300,
    min: 100
  },
  height: {
    type: "number",
    default: 300,
    min: 100
  },
  allSameColors: {
    type: "boolean",
    default: true
  },
  fontMode: {
    type: "text",
    options: {
      "F Grotesk Thin": "FGroteskThin-Regular.otf",
      "F Grotesk": "FGrotesk-Regular.otf"
    },
    default: "F Grotesk Thin"
  }
};

export const presets = {
  bigger: {
    width: 500,
    height: 500
  }
};

export const settings = {
  engine: require("@mechanic-design/engine-react")
};
