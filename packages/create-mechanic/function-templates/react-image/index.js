import React, { useEffect } from "react";

export const handler = ({ inputs, mechanic }) => {
  const { width, height, color } = inputs;

  useEffect(() => {
    mechanic.done();
  }, []);

  return (
    <svg width={width} height={height}>
      <rect fill={color} width={width} height={height} />
    </svg>
  );
};

export const inputs = {
  width: {
    type: "number",
    default: 400,
  },
  height: {
    type: "number",
    default: 300,
  },
  color: {
    type: "color",
    model: "hex",
    default: "#E94225",
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-react"),
};
