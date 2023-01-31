import React, { useEffect, useRef } from "react";

export const handler = ({ inputs, frame, done, useDrawLoop }) => {
  const { width, height, text, color1, color2, radiusPercentage, turns } =
    inputs;

  const center = [width / 2, height / 2];
  const radius = ((height / 2) * radiusPercentage) / 100;
  const angle = useRef(0);

  const isPlaying = useRef(true);

  // frameCount has the number of the current frame, this is based on the framerate
  // your animation is running it. For 60fps the frame at 1 seconds will be 60, whie
  // at 24 fps it will be 24.
  //
  // timestamp has the frame offset in seconds and is always the same, no matter the
  // framerate.
  const { frameCount, timestamp } = useDrawLoop(isPlaying.current);

  useEffect(() => {
    if (angle.current < turns * 360) {
      frame();
      angle.current = 180 * timestamp;
    } else if (isPlaying.current) {
      isPlaying.current = false;
      done();
    }
  }, [timestamp]);

  return (
    <svg width={width} height={height}>
      <rect fill="#F4F4F4" width={width} height={height} />
      <g transform={`translate(${center[0]}, ${center[1]})`}>
        <g transform={`rotate(${angle.current})`}>
          <path
            d={`M ${radius} 0
          A ${radius} ${radius}, 0, 0, 0, ${-radius} 0 Z`}
            fill={color1}
          />
          <path
            d={`M ${-radius} 0
           A ${radius} ${radius}, 0, 0, 0, ${radius} 0 Z`}
            fill={color2}
          />
        </g>
        <text
          x={0}
          y={height / 2 - height / 20}
          textAnchor="middle"
          fontWeight="bold"
          fontFamily="sans-serif"
          fontSize={height / 10}
        >
          {text} {frameCount}
        </text>
      </g>
    </svg>
  );
};

export const inputs = {
  width: {
    type: "number",
    default: 400
  },
  height: {
    type: "number",
    default: 300
  },
  text: {
    type: "text",
    default: "mechanic"
  },
  color1: {
    type: "color",
    model: "hex",
    default: "#E94225"
  },
  color2: {
    type: "color",
    model: "hex",
    default: "#002EBB"
  },
  radiusPercentage: {
    type: "number",
    default: 40,
    min: 0,
    max: 100,
    slider: true
  },
  turns: {
    type: "number",
    default: 3
  }
};

export const presets = {
  medium: {
    width: 800,
    height: 600
  },
  large: {
    width: 1600,
    height: 1200
  }
};

export const settings = {
  engine: require("@mechanic-design/engine-react"),
  animated: true
};
