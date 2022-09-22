import React, { useState, useEffect, useRef } from "react";
import { getColors } from "../../utils/graphics";
import {
  computeBaseBricks,
  computeBlockGeometry,
  precomputeBlocks,
  getIndexModule,
} from "../../utils/blocks";
import { useLoadedOpentypeFont } from "../../utils/hooks";
import { Block } from "../../utils/blocks-components";

export const handler = ({ inputs, mechanic }) => {
  const { width, height, logoWidth, logoRatio, fontMode } = inputs;
  const { done } = mechanic;

  const rows = 2;
  const cols = 13;
  const logoHeight = Math.floor((logoWidth / logoRatio) * rows);
  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];
  const font = useLoadedOpentypeFont(fontMode);

  useEffect(() => {
    if (font) {
      done();
    }
  }, [font]);

  if (!font) {
    return null;
  }

  const blockGeometry = computeBlockGeometry(logoWidth, logoHeight, rows, cols);
  const baseBricks = computeBaseBricks(words, blockGeometry.fontSize, font);
  const blocksByIndex = precomputeBlocks(blockGeometry, baseBricks);

  const blockConfigs = [];
  let position = { x: 0, y: 0 };
  let colors = getColors("Random Flag");
  let brickOffset = 0;

  while (position.y < height) {
    const block =
      blocksByIndex[getIndexModule(brickOffset, blocksByIndex.length)];
    blockConfigs.push({ position, block, colors });
    position = { ...position };
    if (position.x + block.width < width) {
      position.x += block.width;
      brickOffset++;
      colors = getColors("Random Flag");
    } else {
      position.x = position.x - width;
      position.y += block.height;
    }
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
    default: 500,
    min: 100,
  },
  height: {
    type: "number",
    default: 500,
    min: 100,
  },
  logoWidth: {
    type: "number",
    default: 300,
    min: 10,
  },
  logoRatio: {
    type: "number",
    default: 9,
    max: 20,
    slider: true,
    min: 6,
    step: 1,
  },
  fontMode: {
    type: "text",
    options: {
      "F Grotesk Thin": "FGroteskThin-Regular.otf",
      "F Grotesk": "FGrotesk-Regular.otf",
    },
    default: "F Grotesk Thin",
  },
};

export const presets = {
  bigger: {
    width: 1000,
    height: 1000,
  },
  panoramic: {
    width: 1000,
    height: 250,
  },
  long: {
    width: 500,
    height: 1000,
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-react"),
};
