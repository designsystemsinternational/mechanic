import React, { useState, useEffect } from "react";
import engine from "mechanic-react-engine";

export const handler = ({ width, height, done, background, fill, hasInnerHole }) => {
  useEffect(() => {
    done();
  }, []);
  return (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} stroke="none" fill={background} />
      <ellipse
        cx={width / 2}
        cy={height / 2}
        rx={width / 3}
        ry={width / 3}
        stroke="none"
        fill={fill}
      />
      {hasInnerHole && (
        <ellipse
          cx={width / 2}
          cy={height / 2}
          rx={width / 6}
          ry={width / 6}
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
  size: {
    default: {
      width: 600,
      height: 600
    }
  },
  background: {
    type: "string",
    default: "red",
    choices: ["red", "orange", "yellow"]
  },
  fill: {
    type: "string",
    default: "cyan",
    choices: ["cyan", "blue", "green"]
  },
  hasInnerHole: {
    type: "boolean",
    default: false
  }
};

export const settings = {
  engine
};
