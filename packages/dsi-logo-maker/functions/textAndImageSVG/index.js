import React, { useState, useEffect, useRef } from "react";
import { getColors } from "../../utils/graphics";
import {
  computeBaseBricks,
  computeBlockGeometry,
  computeBlock,
} from "../../utils/blocks";
import { Block } from "../../utils/blocks-components";

export const handler = (params) => {
  const {
    width,
    ratio,
    text,
    columns: cols,
    rows,
    colors: colorsString,
    offset,
    image,
    done,
  } = params;

  console.log({ image });

  const words = text.split(" ").map((s) => s.toUpperCase());
  const colors = getColors("Custom Colors", null, colorsString.split(","));
  const height = Math.floor((width / ratio) * rows);

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
  text: {
    type: "text",
    default: "Whatever you want",
  },
  columns: {
    type: "number",
    default: 13,
    min: 1,
    step: 1,
  },
  rows: {
    type: "number",
    default: 2,
    min: 1,
    step: 1,
  },
  colors: {
    type: "text",
    default: "#11457e,#d7141a,#f1f1f1",
  },
  offset: {
    type: "number",
    default: 0,
    min: 0,
    max: 1,
    step: 0.05,
    slider: true,
  },
  image: {
    type: "image",
  },
};

export const presets = {
  bigger: {
    width: 500,
    height: 500,
  },
};

export const settings = {
  engine: require("@designsystemsinternational/mechanic-engine-react"),
  usesRandom: true,
};
