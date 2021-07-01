import React, { useState, useEffect, useRef } from "react";
import { getColors, flagNames } from "../../utils/graphics";
import {
  computeBaseBricks,
  computeBlockGeometry,
  precomputeBlocks,
  getIndexModule,
} from "../../utils/blocks";
import { Unit } from "../../utils/blocks-components";
import { useDrawLoop } from "../../utils/drawLoopHook";

export const handler = ({
  width,
  ratio,
  frame,
  done,
  colorMode,
  flag,
  firstColor,
  secondColor,
  thirdColor,
  offset,
  duration,
  loops,
}) => {
  const [blockParams, setBlockParams] = useState({
    colors: [],
    blocksByIndex: [],
  });
  const [internalOffset, setInternalOffset] = useState(0);
  const isPlaying = useRef(false);
  const progress = useRef(0);
  const runtime = useDrawLoop(isPlaying.current, duration);

  const rows = 2;
  const cols = 13;
  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];
  const height = Math.floor((width / ratio) * rows);

  const { colors, blocksByIndex } = blockParams;

  const brickIndex = Math.floor(offset * blocksByIndex.length) + internalOffset;

  const position = { x: 0, y: 0 };
  const animation = {
    stepRate: (rows * cols * Math.floor(Math.random() * 4 + 1)) / duration,
    progress: 0,
    duration,
  };

  useEffect(() => {
    const colors = getColors(colorMode, flag, [
      firstColor,
      secondColor,
      thirdColor,
    ]);
    const blockGeometry = computeBlockGeometry(width, height, rows, cols);
    const baseBricks = computeBaseBricks(words, blockGeometry.fontSize);
    const blocksByIndex = precomputeBlocks(blockGeometry, baseBricks);
    setBlockParams({
      colors,
      blocksByIndex,
    });
    isPlaying.current = true;
  }, []);

  useEffect(() => {
    if (runtime < duration) {
      frame();
      let currentProgress = Math.floor(2 * loops * cols * (runtime / duration));
      if (currentProgress > progress.current) {
        progress.current = currentProgress;
        setInternalOffset((internalOffset) => internalOffset + 1);
      }
    } else {
      isPlaying.current = false;
      done();
    }
  }, [runtime]);

  return (
    <svg width={width} height={height}>
      {blocksByIndex.length && (
        <Unit
          key={`${position.x}-${position.y}`}
          position={position}
          blocks={blockParams.blocksByIndex}
          blockIndex={brickIndex}
          colors={colors}
          animation={animation}
          runtime={runtime}
        ></Unit>
      )}
    </svg>
  );
};

export const params = {
  width: {
    type: "number",
    default: 500,
    min: 100,
  },
  ratio: {
    type: "number",
    default: 9,
    max: 20,
    slider: true,
    min: 6,
    step: 1,
  },
  colorMode: {
    type: "text",
    options: ["Random Flag", "Pick Flag", "Custom Colors"],
    default: "Random Flag",
  },
  flag: {
    type: "text",
    options: flagNames,
    default: flagNames[0],
  },
  firstColor: {
    type: "color",
    model: "hex",
    default: "#11457e",
  },
  secondColor: {
    type: "color",
    model: "hex",
    default: "#d7141a",
  },
  thirdColor: {
    type: "color",
    model: "hex",
    default: "#f1f1f1",
  },
  offset: {
    type: "number",
    default: 0,
    min: 0,
    max: 1,
    step: 0.05,
    slider: true,
  },
  duration: {
    type: "number",
    default: 5000,
    step: 500,
    min: 1000,
  },
  loops: {
    type: "number",
    default: 4,
    min: 1,
    step: 1,
  },
};

export const presets = {
  bigger: {
    width: 1000,
    ratio: 9,
  },
  biggerr: {
    width: 1500,
    ratio: 9,
  },
};

export const settings = {
  engine: require("@designsystemsinternational/mechanic-engine-react").run,
  animated: true,
  usesRandom: true,
};
