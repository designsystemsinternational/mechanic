import React, { useState, useEffect, useRef } from "react";

export const handler = ({ height, frame, done, background, fill }) => {
  const width = height;

  const isPlaying = useRef(true);
  const frameCount = useDrawLoop(isPlaying.current);

  const r = width / 3;
  const x = frameCount;

  useEffect(() => {
    if (frameCount < 100) {
      frame();
    } else if (isPlaying.current) {
      isPlaying.current = false;
      done();
    }
  }, [frameCount]);

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
      <ellipse cx={x} cy={height / 2} rx={r} ry={r} stroke="none" fill={fill} />
    </svg>
  );
};

export const params = {
  height: {
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
};

export const settings = {
  engine: require("@designsystemsinternational/mechanic-engine-react"),
  animated: true,
};

const useDrawLoop = (isPlaying) => {
  const raf = useRef();
  const [frameCount, setFrameCount] = useState(0);

  useEffect(() => {
    cancelAnimationFrame(raf.current);

    if (!isPlaying) {
      return;
    }

    const draw = () => {
      setFrameCount((cur) => cur + 1);
      raf.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf.current);
    };
  }, [isPlaying]);

  return frameCount;
};
