import React, { useEffect } from "react";

export const handler = ({ width, done, background, fill, hasInnerHole }) => {
  const height = width;
  const radius = width / 3;
  useEffect(() => {
    done();
  }, []);
  return (
    <svg width={width} height={height}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        stroke="none"
        fill={background}
      />
      <ellipse
        cx={width / 2}
        cy={height / 2}
        rx={radius}
        ry={radius}
        stroke="none"
        fill={fill}
      />
      {hasInnerHole && (
        <ellipse
          cx={width / 2}
          cy={height / 2}
          rx={radius / 2}
          ry={radius / 2}
          stroke="none"
          fill={background}
        />
      )}
    </svg>
  );
};

// This will need to be parsed into a JSON file for the API
// We will probably do this with a webpack loader
// We also need a nicer API to create this file
export const params = {
  width: {
    type: "number",
    default: 600,
  },
  background: {
    type: "color",
    default: "red",
    options: ["red", "orange", "yellow"],
  },
  fill: {
    type: "color",
    default: "cyan",
    options: ["cyan", "blue", "green"],
  },
  hasInnerHole: {
    type: "boolean",
    default: false,
  },
};

export const settings = {
  engine: require("@designsystemsinternational/mechanic-engine-react"),
};
