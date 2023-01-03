import React, { useState, useEffect, useRef, useMemo } from "react";
import { getColors, flagNames } from "../../utils/graphics";
import {
  computeBaseBricks,
  computeBlockGeometry,
  precomputeBlocks,
  getIndexModule
} from "../../utils/blocks";
import { Unit } from "../../utils/blocks-components";
import { useLoadedOpentypeFont } from "../../utils/hooks";

export const handler = ({ inputs, frame, done, useDrawLoop }) => {
  const {
    width,
    ratio,
    colorMode,
    flag,
    firstColor,
    secondColor,
    thirdColor,
    offset,
    duration,
    loops,
    fontMode
  } = inputs;
  const [internalOffset, setInternalOffset] = useState(0);
  const progress = useRef(0);
  const [state, setState] = useState("loading");
  const font = useLoadedOpentypeFont(fontMode);
  const frameCount = useDrawLoop(state === "playing");

  const rows = 2;
  const cols = 13;
  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];
  const height = Math.floor((width / ratio) * rows);

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

    const colors = getColors(colorMode, flag, [
      firstColor,
      secondColor,
      thirdColor
    ]);

    const blockGeometry = computeBlockGeometry(width, height, rows, cols);
    const baseBricks = computeBaseBricks(words, blockGeometry.fontSize, font);
    const blocksByIndex = precomputeBlocks(blockGeometry, baseBricks);

    return {
      colors,
      blocksByIndex
    };
  }, [font]);

  const { colors, blocksByIndex } = blockParams;
  const brickIndex = Math.floor(offset * blocksByIndex.length) + internalOffset;
  const position = { x: 0, y: 0 };
  const animation = {
    stepRate: (rows * cols * Math.floor(Math.random() * 4 + 1)) / duration,
    progress: 0,
    duration
  };

  useEffect(() => {
    if (state === "playing") {
      if (frameCount < duration) {
        frame();
        let currentProgress = Math.floor(
          2 * loops * cols * (frameCount / duration)
        );
        if (currentProgress > progress.current) {
          progress.current = currentProgress;
          setInternalOffset(internalOffset => internalOffset + 1);
        }
      } else {
        setState("stopped");
        done();
      }
    }
  }, [frameCount]);

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
          runtime={frameCount}
        ></Unit>
      )}
    </svg>
  );
};

export const inputs = {
  width: {
    type: "number",
    default: 500,
    min: 100
  },
  ratio: {
    type: "number",
    default: 9,
    max: 20,
    slider: true,
    min: 6,
    step: 1
  },
  colorMode: {
    type: "text",
    options: ["Random Flag", "Pick Flag", "Custom Colors"],
    default: "Random Flag"
  },
  flag: {
    type: "text",
    options: flagNames,
    default: flagNames[0],
    editable: inputs => inputs.colorMode === "Pick Flag"
  },
  firstColor: {
    type: "color",
    model: "hex",
    default: "#11457e",
    editable: inputs => inputs.colorMode === "Custom Colors"
  },
  secondColor: {
    type: "color",
    model: "hex",
    default: "#d7141a",
    editable: inputs => inputs.colorMode === "Custom Colors"
  },
  thirdColor: {
    type: "color",
    model: "hex",
    default: "#f1f1f1",
    editable: inputs => inputs.colorMode === "Custom Colors"
  },
  offset: {
    type: "number",
    default: 0,
    min: 0,
    max: 1,
    step: 0.05,
    slider: true
  },
  duration: {
    type: "number",
    default: 300,
    step: 10,
    min: 10,
    label: "Duration in frames"
  },
  loops: {
    type: "number",
    default: 4,
    min: 1,
    step: 1
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

export const presets = {
  bigger: {
    width: 1000,
    ratio: 9
  },
  biggerr: {
    width: 1500,
    ratio: 9
  }
};

export const settings = {
  engine: require("@mechanic-design/engine-react"),
  animated: true
};
