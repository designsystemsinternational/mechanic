import React, { useState, useEffect, useRef } from "react";
import engine from "mechanic-engine-react";
import { getColors } from "../utils/graphics";
import { computeBaseBricks, computeBlockGeometry, precomputeBlocks } from "../utils/blocks";
import { Block } from "../utils/blocks-components";

export const handler = ({ width, height, done, logoWidth, logoRatio }) => {
  const rows = 2;
  const cols = 13;
  const logoHeight = Math.floor((logoWidth / logoRatio) * rows);
  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];

  const blockGeometry = computeBlockGeometry(logoWidth, logoHeight, rows, cols);
  const baseBricks = computeBaseBricks(words, blockGeometry.fontSize);
  const blocksByIndex = precomputeBlocks(blockGeometry, baseBricks, baseBricks.length);

  const blockConfigs = [];
  let position = { x: 0, y: 0 };
  let colors = getColors("Random Flag");
  let offset = 0;
  let brickIndex = baseBricks.length - (offset % baseBricks.length);

  while (position.y < height) {
    const block = blocksByIndex[brickIndex % baseBricks.length];
    blockConfigs.push({ position, block, colors });
    position = { ...position };
    if (position.x + block.width < width) {
      position.x += block.width;
      offset++;
      brickIndex = baseBricks.length - (offset % baseBricks.length);
      colors = getColors("Random Flag");
    } else {
      position.x = position.x - width;
      position.y += block.height;
    }
  }

  useEffect(() => {
    done();
  }, []);

  return (
    <svg width={width} height={height}>
      {blockConfigs.map(({ position, block, colors }) => (
        <Block
          key={`${position.x}-${position.y}`}
          position={position}
          block={block}
          colors={colors}></Block>
      ))}
    </svg>
  );
};

export const params = {
  size: {
    default: {
      width: 300,
      height: 300
    },
    bigger: {
      width: 1000,
      height: 1000
    },
    panoramic: {
      width: 1000,
      height: 250
    },
    long: {
      width: 500,
      height: 1000
    }
  },
  logoWidth: {
    type: "integer",
    default: 80
  },
  logoRatio: {
    type: "integer",
    default: 9
  }
};

export const settings = {
  engine
};
