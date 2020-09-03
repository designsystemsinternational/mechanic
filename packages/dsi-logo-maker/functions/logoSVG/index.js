import React, { useEffect } from "react";
import engine from "mechanic-engine-react";
import { getColors, flagNames } from "../utils/graphics";
import { computeBaseBricks, computeBlockGeometry, computeBlock } from "../utils/blocks";
import { Block } from "../utils/blocks-components";

export const handler = ({ width, height, done, colorMode, flag, colors: colorsString, offset }) => {
  const rows = 2;
  const cols = 13;
  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];

  const colors = getColors(colorMode, flag, colorsString);
  const position = { x: 0, y: 0 };
  const blockGeometry = computeBlockGeometry(width, height, rows, cols);
  const baseBricks = computeBaseBricks(words, blockGeometry.fontSize);

  const block = computeBlock(blockGeometry, baseBricks, offset);

  useEffect(() => {
    done();
  }, []);

  return (
    <svg width={width} height={height}>
      <Block position={position} block={block} colors={colors}></Block>
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
