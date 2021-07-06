import React, { useState, useEffect, useRef } from "react";
import { getColors } from "../../utils/graphics";
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
  height,
  frame,
  done,
  logoWidth,
  logoRatio,
  duration,
}) => {
  const [blockParams, setBlockParams] = useState({
    blocksByIndex: [],
    blockConfigs: [],
  });

  const isPlaying = useRef(false);
  const runtime = useDrawLoop(isPlaying.current, duration);

  const rows = 2;
  const cols = 13;
  const logoHeight = Math.floor((logoWidth / logoRatio) * rows);
  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];

  useEffect(() => {
    let colors = getColors("Random Flag");
    const blockGeometry = computeBlockGeometry(
      logoWidth,
      logoHeight,
      rows,
      cols
    );
    const baseBricks = computeBaseBricks(words, blockGeometry.fontSize);
    const blocksByIndex = precomputeBlocks(blockGeometry, baseBricks);

    const blockConfigs = [];
    let position = { x: 0, y: 0 };
    let brickOffset = 0;

    while (position.y < height) {
      const blockIndex = getIndexModule(brickOffset, blocksByIndex.length);
      const animation = {
        stepRate: (rows * cols * Math.floor(Math.random() * 4 + 1)) / duration,
        progress: 0,
        duration,
      };
      blockConfigs.push({ position, blockIndex, colors, animation });
      position = { ...position };
      if (position.x + blockGeometry.width < width) {
        position.x += blockGeometry.width;
        colors = getColors("Random Flag");
        brickOffset++;
      } else {
        position.x = position.x - width;
        position.y += blockGeometry.height;
      }
    }
    setBlockParams({ blocksByIndex, blockConfigs });
    isPlaying.current = true;
  }, []);

  useEffect(() => {
    if (runtime < duration) {
      frame();
    } else {
      isPlaying.current = false;
      done();
    }
  }, [runtime]);

  const { blockConfigs } = blockParams;
  return (
    <svg width={width} height={height}>
      {blockConfigs &&
        blockConfigs.map(({ position, blockIndex, colors, animation }) => (
          <Unit
            key={`${position.x}-${position.y}`}
            position={position}
            blocks={blockParams.blocksByIndex}
            blockIndex={blockIndex}
            colors={colors}
            animation={animation}
            runtime={runtime}
          ></Unit>
        ))}
    </svg>
  );
};

export const params = {
  width: {
    type: "number",
    default: 100,
    min: 100,
  },
  height: {
    type: "number",
    default: 200,
    min: 100,
  },
  logoWidth: {
    type: "number",
    default: 80,
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
  duration: {
    type: "number",
    default: 5000,
    step: 500,
    min: 1000,
  },
};

export const settings = {
  engine: require("@designsystemsinternational/mechanic-engine-react").run,
  animated: true,
  usesRandom: true,
};
