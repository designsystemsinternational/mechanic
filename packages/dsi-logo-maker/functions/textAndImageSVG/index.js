import React, { useState, useEffect, useRef } from "react";
import { getColors } from "../../utils/graphics";
import {
  computeBaseBricks,
  computeBlockGeometry,
  computeBlock,
} from "../../utils/blocks";
import { Block } from "../../utils/blocks-components";

export const handler = ({ params, mechanic }) => {
  const {
    width,
    ratio,
    text,
    columns: cols,
    rows,
    colors: colorsString,
    offset,
    image,
  } = params;
  const { done } = mechanic;

  const [href, setHref] = useState("");

  const words = text.split(" ").map((s) => s.toUpperCase());
  const colors = getColors("Custom Colors", null, colorsString.split(","));
  const height = Math.floor((width / ratio) * rows);

  const position = { x: image ? height : 0, y: 0 };
  const blockGeometry = computeBlockGeometry(width, height, rows, cols);
  const baseBricks = computeBaseBricks(words, blockGeometry.fontSize);

  const block = computeBlock(
    blockGeometry,
    baseBricks,
    Math.floor(offset * baseBricks.length)
  );

  useEffect(() => {
    if (image) {
      const reader = new FileReader();

      reader.readAsDataURL(image);

      reader.onload = function () {
        setHref(reader.result);
      };

      reader.onerror = function () {
        console.error(reader.error);
      };
    }
  }, []);

  useEffect(() => {
    if (!image || href !== "") {
      done();
    }
  }, [image, href]);

  return (
    <svg width={width + (image ? height : 0)} height={height}>
      <image href={href} height={height}></image>
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
    multiple: false,
  },
};

export const presets = {
  bigger: {
    width: 500,
    height: 500,
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-react"),
  usesRandom: true,
};
