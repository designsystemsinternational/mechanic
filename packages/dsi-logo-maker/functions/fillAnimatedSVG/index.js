import React, { useState, useEffect, useMemo } from "react";
import { getColors } from "../../utils/graphics";
import {
  computeBaseBricks,
  computeBlockGeometry,
  precomputeBlocks,
  getIndexModule
} from "../../utils/blocks";
import { Unit } from "../../utils/blocks-components";
import { useLoadedOpentypeFont } from "../../utils/hooks";

export const handler = ({ inputs, frame, done, useDrawLoop }) => {
  const { width, height, logoWidth, logoRatio, duration, fontMode } = inputs;

  const [state, setState] = useState("loading");
  const font = useLoadedOpentypeFont(fontMode);
  const { timestamp } = useDrawLoop(state === "playing");

  const rows = 2;
  const cols = 13;
  const logoHeight = Math.floor((logoWidth / logoRatio) * rows);
  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];

  useEffect(() => {
    if (state === "loading" && font) {
      setState("playing");
    }
  }, [font, state, setState]);

  const blockParams = useMemo(() => {
    if (!font) {
      return {
        blocksByIndex: [],
        blockConfigs: []
      };
    }

    let colors = getColors("Random Flag");
    const blockGeometry = computeBlockGeometry(
      logoWidth,
      logoHeight,
      rows,
      cols
    );
    const baseBricks = computeBaseBricks(words, blockGeometry.fontSize, font);
    const blocksByIndex = precomputeBlocks(blockGeometry, baseBricks);

    const blockConfigs = [];
    let position = { x: 0, y: 0 };
    let brickOffset = 0;

    while (position.y < height) {
      const blockIndex = getIndexModule(brickOffset, blocksByIndex.length);
      const animation = {
        stepRate: (rows * cols * Math.floor(Math.random() * 4 + 1)) / duration,
        progress: 0,
        duration
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
    return { blocksByIndex, blockConfigs };
  }, [font]);

  useEffect(() => {
    if (state === "playing") {
      if (timestamp < duration) {
        frame();
      } else {
        setState("stopped");
        done();
      }
    }
  }, [timestamp, state, setState]);

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
            runtime={timestamp}
          ></Unit>
        ))}
    </svg>
  );
};

export const inputs = {
  width: {
    type: "number",
    default: 500,
    min: 100
  },
  height: {
    type: "number",
    default: 500,
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
  duration: {
    type: "number",
    default: 3,
    step: 0.1,
    min: 1,
    label: "Duration in seconds"
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
  engine: require("@mechanic-design/engine-react"),
  animated: true
};
