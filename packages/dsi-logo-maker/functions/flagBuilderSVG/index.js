import React, { useEffect, useMemo } from "react";

import { getColors, flagNames } from "../../utils/graphics";
import { buildSeeds } from "../../utils/seeds";
import { buildBlocks } from "../../utils/flagBlocks";

export const handler = ({ inputs, mechanic }) => {
  const {
    width,
    height,
    colorMode,
    flag,
    firstColor,
    secondColor,
    thirdColor,
    seedMode,
    seedText,
    seedForDistribution,
    seedForOffset
  } = inputs;

  const colors = getColors(colorMode, flag, [
    firstColor,
    secondColor,
    thirdColor
  ]);

  const { seedDistribution, seedOffset } = buildSeeds(seedMode, seedText, {
    seedForDistribution,
    seedForOffset
  });

  const blocks = useMemo(() => {
    return buildBlocks({
      width,
      height,
      seedDistribution,
      seedOffset,
      colors
    });
  }, [width, height, seedDistribution, seedOffset, colors]);

  useEffect(() => {
    mechanic.done();
  }, []);

  return (
    <svg width={width} height={height}>
      {blocks.map((block, i) => (
        <rect
          key={i}
          x={block.x}
          y={block.y}
          width={block.w}
          height={block.h}
          fill={block.color}
        />
      ))}
    </svg>
  );
};

export const inputs = {
  width: {
    type: "number",
    default: 600
  },
  height: {
    type: "number",
    default: 400
  },
  seedMode: {
    type: "text",
    options: ["From Text", "Set Numbers"],
    default: "From Text"
  },
  seedText: {
    type: "text",
    default: "Seed text",
    editable: inputs => inputs.seedMode === "From Text"
  },
  seedForDistribution: {
    type: "number",
    default: 0,
    editable: inputs => inputs.seedMode === "Set Numbers"
  },
  seedForOffset: {
    type: "number",
    default: 0,
    editable: inputs => inputs.seedMode === "Set Numbers"
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
  }
};

export const settings = {
  engine: require("@mechanic-design/engine-react")
};
