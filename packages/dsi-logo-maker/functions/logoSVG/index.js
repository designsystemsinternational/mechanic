import React, { useEffect } from "react";
import engine from "mechanic-engine-react";
import { getRandomFlag, flagNames, getFlag, genColorObject } from "../logo-utils/graphics";
import { computeBaseBricks, computeBlockGeometry, computeBlock } from "../logo-utils/blocks";
import { Block } from "../logo-utils/blocks-components";

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
  const position = { x: 0, y: 0 };
  const blockGeometry = computeBlockGeometry(width, height, rows, cols);
  const baseBricks = computeBaseBricks(words, colors.length, blockGeometry.fontSize);
  let brickIndex = baseBricks.length - (offset % baseBricks.length);

  const block = computeBlock(blockGeometry, baseBricks, brickIndex);

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
