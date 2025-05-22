import React, { useEffect } from "react";
import { getColors, flagNames } from "../../utils/graphics";
import {
  computeBaseBricks,
  computeBlockGeometry,
  computeBlock
} from "../../utils/blocks";
import { useLoadedOpentypeFont } from "../../utils/hooks";
import { Block } from "../../utils/blocks-components";

export const handler = ({ inputs, done }) => {
  const {
    width,
    ratio,
    fontMode,
    colorMode,
    flag,
    firstColor,
    secondColor,
    thirdColor,
    offset
  } = inputs;
  const rows = 2;
  const cols = 13;
  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];
  const height = Math.floor((width / ratio) * rows);
  const font = useLoadedOpentypeFont(fontMode);

  useEffect(() => {
    if (font) {
      done(colorMode !== "Custom Colors" ? `${flag}-${offset}` : null);
    }
  }, [font]);

  if (!font) {
    return null;
  }

  const colors = getColors(colorMode, flag, [
    firstColor,
    secondColor,
    thirdColor
  ]);
  const position = { x: 0, y: 0 };
  const blockGeometry = computeBlockGeometry(width, height, rows, cols);
  const baseBricks = computeBaseBricks(words, blockGeometry.fontSize, font);

  const block = computeBlock(
    blockGeometry,
    baseBricks,
    Math.floor(offset * baseBricks.length)
  );

  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id="Gradient1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#cfb53b" />
          <stop offset="50%" stopColor="#fff0ab" />
          <stop offset="100%" stopColor="#cfb53b" />
        </linearGradient>
      </defs>
      <Block
        position={position}
        block={block}
        colors={colors}
        stroke={"url(#Gradient1)"}
      ></Block>
      <rect
        width={width}
        height={height}
        fill="none"
        stroke="url(#Gradient1)"
        strokeWidth="10"
        strokeLinecap="square"
      ></rect>
      <line
        x1={0}
        y1={height / 2 - 2.5}
        x2={width}
        y2={height / 2 - 2.5}
        strokeWidth="5"
        stroke={"#fff0ab"}
        strokeLinecap="square"
      ></line>
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
  fontMode: {
    type: "text",
    options: {
      "F Grotesk Thin": "FGroteskThin-Regular.otf",
      "F Grotesk": "FGrotesk-Regular.otf"
    },
    default: "F Grotesk"
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
    step: 0.02,
    slider: true
  }
};

export const presets = {
  big: {
    width: 1000,
    ratio: 9
  },
  bigger: {
    width: 1500,
    ratio: 9
  }
};

export const settings = {
  engine: require("@mechanic-design/engine-react")
};
