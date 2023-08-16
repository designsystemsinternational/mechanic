import React, { useEffect } from "react";
import {
  computeBaseBricks,
  computeBlockGeometry,
  precomputeBlocks,
  getIndexModule
} from "../../utils/blocks";
import { useLoadedOpentypeFont } from "../../utils/hooks";
import { Block } from "../../utils/blocks-components";
import { greys } from "../../utils/graphics";

export const handler = ({ inputs, mechanic }) => {
  const {
    width,
    height,
    logoWidth,
    logoRatio,
    fontMode,
    firstColor,
    secondColor,
    thirdColor
  } = inputs;
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
  let colors = [greys[firstColor], greys[secondColor], greys[thirdColor]];
  let brickOffset = 0;

  while (position.y < height) {
    const block =
      blocksByIndex[getIndexModule(brickOffset, blocksByIndex.length)];
    blockConfigs.push({ position, block, colors });
    position = { ...position };
    if (position.x + block.width < width) {
      position.x += block.width;
      brickOffset++;
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
    default: 1920,
    min: 100
  },
  height: {
    type: "number",
    default: 1080,
    min: 100
  },
  logoWidth: {
    type: "number",
    default: 300,
    min: 10
  },
  logoRatio: {
    type: "number",
    default: 9,
    max: 20,
    slider: true,
    min: 6,
    step: 1
  },
  firstColor: {
    type: "text",
    default: "grey1",
    options: Object.keys(greys)
  },
  secondColor: {
    type: "text",
    default: "grey2",
    options: Object.keys(greys)
  },
  thirdColor: {
    type: "text",
    default: "grey3",
    options: Object.keys(greys)
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

export const settings = {
  engine: require("@mechanic-design/engine-react")
};
