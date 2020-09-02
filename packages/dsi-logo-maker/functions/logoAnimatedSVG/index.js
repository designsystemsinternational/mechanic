import React, { useState, useEffect, useRef } from "react";
import engine from "mechanic-engine-react";
import { getColors, flagNames } from "../utils/graphics";
import { computeBaseBricks, computeBlockGeometry, precomputeBlocks } from "../utils/blocks";
import { Block } from "../utils/blocks-components";
import { useDrawLoop } from "../utils/drawLoopHook";

export const handler = ({
  width,
  height,
  frame,
  done,
  colorMode,
  flag,
  colors: colorsString,
  offset,
  duration,
  loops
}) => {
  const [blockParams, setBlockParams] = useState({
    colors: [],
    baseBricks: [],
    blocksByIndex: []
  });
  const [internalOffset, setInternalOffset] = useState(0);
  const isPlaying = useRef(false);
  const progress = useRef(0);
  const runtime = useDrawLoop(isPlaying.current);

  const rows = 2;
  const cols = 13;
  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];

  const { colors, baseBricks, blocksByIndex } = blockParams;

  const totalOffset = offset + internalOffset;
  const brickIndex = baseBricks ? baseBricks.length - (totalOffset % baseBricks.length) : 0;

  const position = { x: 0, y: 0 };
  const block = blocksByIndex[brickIndex % baseBricks.length];

  useEffect(() => {
    const colors = getColors(colorMode, flag, colorsString);
    const blockGeometry = computeBlockGeometry(width, height, rows, cols);
    const baseBricks = computeBaseBricks(words, blockGeometry.fontSize);
    const blocksByIndex = precomputeBlocks(blockGeometry, baseBricks, baseBricks.length);
    setBlockParams({
      colors,
      baseBricks,
      blocksByIndex
    });
    isPlaying.current = true;
  }, []);

  const direction = -1;
  useEffect(() => {
    if (isPlaying.current && runtime < duration) {
      frame();
      let currentProgress = Math.floor(2 * loops * cols * (runtime / duration));
      if (currentProgress > progress.current) {
        progress.current = currentProgress;
        setInternalOffset(internalOffset => internalOffset + 1 * direction);
      }
    } else if (isPlaying.current) {
      isPlaying.current = false;
      done();
    }
  }, [runtime]);

  return (
    <svg width={width} height={height}>
      {block && <Block position={position} block={block} colors={colors}></Block>}
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
