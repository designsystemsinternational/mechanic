import React, { useEffect, useRef } from "react";

import { Circle } from "./Circle";
import { useDrawLoop } from "./utils";
import "./styles.css";

export const handler = ({ inputs, mechanic }) => {
  const {
    width,
    height,
    backgroundColor,
    colorOne,
    colorTwo,
    fontScale,
    text,
    minRadius,
    maxRadius,
    duration,
  } = inputs;

  // stuff needed for the looping
  const startTime = useRef(Date.now());
  const isPlaying = useRef(true);
  const frameCount = useDrawLoop(isPlaying.current);
  const lines = text.split(" ");

  // function to determine when to end the animation
  useEffect(() => {
    if (Date.now() - startTime.current < duration * 1000) {
      mechanic.frame();
    } else if (isPlaying.current) {
      isPlaying.current = false;
      mechanic.done();
    }
  }, [frameCount]);

  // colors and font sizes
  const textColor = backgroundColor;
  const fontSize = ((height / 8) * fontScale) / 100;
  const lineHeight = fontSize * 0.85;

  // this trick helps us center the text vertically
  const firstLine = height / 2 - lineHeight * ((lines.length - 2) / 2);

  // this is an array where will  store the circles
  const circles = [];

  for (let i = 0; i < Math.min(Math.floor(frameCount / 15), 20); i++) {
    circles.push(
      <Circle
        key={i}
        minX={0}
        maxX={width}
        minY={0}
        maxY={height}
        minRadius={(width / 100) * minRadius}
        maxRadius={(width / 100) * maxRadius}
        colorOne={colorOne}
        colorTwo={colorTwo}
      />
    );
  }

  return (
    <svg width={width} height={height}>
      <rect fill={backgroundColor} width={width} height={height} />
      {circles}
      {lines.map((line, index) => {
        return (
          <text
            key={index}
            x={width / 2}
            y={firstLine + index * lineHeight}
            textAnchor="middle"
            fill={textColor}
            fontWeight="bold"
            fontFamily="Object Sans"
            fontSize={fontSize}
          >
            {line}
          </text>
        );
      })}
    </svg>
  );
};

export const inputs = {
  width: {
    type: "number",
    default: 1080,
  },
  height: {
    type: "number",
    default: 1920,
  },
  backgroundColor: {
    type: "color",
    model: "hex",
    default: "#FDD7D1",
  },

  colorOne: {
    type: "color",
    model: "hex",
    default: "#E94225",
  },
  colorTwo: {
    type: "color",
    model: "hex",
    default: "#002EBB",
  },
  fontScale: {
    label: "Font Scale (%)",
    type: "number",
    default: 100,
    slider: true,
    min: 5,
    max: 200,
  },
  text: {
    type: "text",
    default: "TURN YOUR DESIGN RULES INTO DESIGN TOOLS",
  },

  minRadius: {
    label: "Min Radius (% of width)",
    type: "number",
    default: 5,
    min: 0,
    max: 200,
    slider: true,
  },
  maxRadius: {
    label: "Max Radius (% of width)",
    type: "number",
    default: 10,
    min: 0,
    max: 200,
    slider: true,
  },
  duration: {
    label: "Duration (seconds)",
    type: "number",
    default: 20,
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-react"),
  animated: true,
};
