import React, { useState, useEffect, useRef } from "react";
import engine from "mechanic-engine-react";
import { getRandomFlag, flagNames, getFlag, genColorObject } from "../logo-utils/graphics";
import { computeBaseBricks, computeBlockGeometry, precomputeBlocks } from "../logo-utils/blocks";
import { Block } from "../logo-utils/blocks-components";
import { useDrawLoop } from "../logo-utils/drawLoopHook";

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
  const [colors, setColors] = useState(null);
  const [baseBricks, setBaseBricks] = useState(null);
  const [blocksByIndex, setBlocksByIndex] = useState(null);
  const [internalOffset, setInternalOffset] = useState(0);
  const isPlaying = useRef(true);
  const progress = useRef(0);
  const runtime = useDrawLoop(isPlaying.current);

  const rows = 2;
  const cols = 13;
  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];

  useEffect(() => {
    let choice;
    if (colorMode === "Custom Colors") {
      choice = colorsString.split(",").map(genColorObject);
    } else if (colorMode === "Pick Flag") {
      let f = getFlag(flag);
      choice = f.colors;
    } else {
      choice = getRandomFlag().colors;
    }
    const blockGeometry = computeBlockGeometry(width, height, rows, cols);
    const bricks = computeBaseBricks(words, blockGeometry.fontSize);
    const blocks = precomputeBlocks(blockGeometry, bricks, bricks.length);
    setColors(choice);
    setBaseBricks(bricks);
    setBlocksByIndex(blocks);
  }, []);

  const totalOffset = offset + internalOffset;
  const brickIndex = baseBricks ? baseBricks.length - (totalOffset % baseBricks.length) : 0;

  const position = { x: 0, y: 0 };
  const block = blocksByIndex ? blocksByIndex[brickIndex % baseBricks.length] : null;

  const direction = -1;
  useEffect(() => {
    if (runtime < duration) {
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
