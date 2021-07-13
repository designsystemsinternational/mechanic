import React, { useEffect } from "react";
import { getColors, flagNames } from "../../utils/graphics";
import {
  computeBaseBricks,
  computeBlockGeometry,
  computeBlock,
} from "../../utils/blocks";
import { Block } from "../../utils/blocks-components";

export const handler = ({
  width,
  ratio,
  done,
  colorMode,
  flag,
  firstColor,
  secondColor,
  thirdColor,
  offset,
}) => {
  const rows = 2;
  const cols = 13;
  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];
  const height = Math.floor((width / ratio) * rows);

  const colors = getColors(colorMode, flag, [
    firstColor,
    secondColor,
    thirdColor,
  ]);
  const position = { x: 0, y: 0 };
  const blockGeometry = computeBlockGeometry(width, height, rows, cols);
  const baseBricks = computeBaseBricks(words, blockGeometry.fontSize);

  const block = computeBlock(
    blockGeometry,
    baseBricks,
    Math.floor(offset * baseBricks.length)
  );

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
  engine: require("@designsystemsinternational/mechanic-engine-react"),
  usesRandom: true,
};
