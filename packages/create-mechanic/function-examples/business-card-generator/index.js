import React, { useEffect } from "react";
import "./styles.css";

export const handler = ({ inputs, mechanic }) => {
  const {
    width,
    height,
    backgroundColor,
    colorOne,
    colorTwo,
    fontScale,
    company,
    name,
    email,
    phone,
  } = inputs;

  const margin = width / 18;
  const fontSize = (width / 18) * fontScale;
  const textTop = margin + fontSize * 0.7;
  const lineHeight = fontSize * 1.2;
  // circle
  const circleRadius = width / 10;
  const circleRadiusRotate = Math.random() * 360;
  const circleX =
    margin +
    circleRadius +
    Math.random() * (width - margin * 2 - circleRadius * 2);
  const circleY =
    margin +
    circleRadius +
    Math.random() * (height - margin * 2 - circleRadius * 2);

  useEffect(() => {
    mechanic.done();
  }, []);

  return (
    <svg width={width} height={height}>
      <rect fill={backgroundColor} width={width} height={height} />

      {/* The mechanic mini-logo */}

      <g
        transform={`translate(${circleX} ${circleY}) rotate(${circleRadiusRotate})`}
      >
        <path
          d={`M ${circleRadius} 0
          A ${circleRadius} ${circleRadius}, 0, 0, 0, ${-circleRadius} 0 Z`}
          fill={colorOne}
        />
        <path
          d={`M ${-circleRadius} 0
           A ${circleRadius} ${circleRadius}, 0, 0, 0, ${circleRadius} 0 Z`}
          fill={colorTwo}
        />
      </g>

      {/* The text */}

      <text
        x={margin}
        y={textTop}
        fill={colorOne}
        textAnchor="start"
        fontWeight="bold"
        fontFamily="Object Sans"
        fontSize={fontSize}
      >
        {name}
      </text>

      <text
        x={margin}
        y={textTop + lineHeight}
        fill={colorOne}
        textAnchor="start"
        fontWeight="normal"
        fontFamily="Object Sans"
        fontSize={fontSize}
      >
        {email}
      </text>

      <text
        x={margin}
        y={textTop + lineHeight * 2}
        fill={colorOne}
        textAnchor="start"
        fontWeight="normal"
        fontFamily="Object Sans"
        fontSize={fontSize}
      >
        {phone}
      </text>

      {/* To align something to the right, use the width minus the margin*/}
      <text
        x={width - margin}
        y={height - margin}
        fill={colorOne}
        textAnchor="end"
        fontWeight="bold"
        fontFamily="Object Sans"
        fontSize={fontSize}
      >
        {company}
      </text>
    </svg>
  );
};

export const inputs = {
  width: {
    type: "number",
    default: 850,
  },
  height: {
    type: "number",
    default: 550,
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
    type: "number",
    default: 1,
    slider: true,
    min: 0.1,
    max: 3,
    step: 0.01,
  },
  company: {
    type: "text",
    default: "MECHANIC",
  },
  name: {
    type: "text",
    default: "Martin Bravo",
  },
  email: {
    type: "text",
    default: "martin@mechanic.design",
  },
  phone: {
    type: "text",
    default: "+1 999 999 9999",
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-react"),
};
