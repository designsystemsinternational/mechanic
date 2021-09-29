import React, { useRef } from "react";

export const Circle = ({
  minX,
  maxX,
  minY,
  maxY,
  minRadius,
  maxRadius,
  colorOne,
  colorTwo,
}) => {
  const x = useRef(minX + Math.random() * maxX - minX);
  const y = useRef(minY + Math.random() * (maxY - minY));
  const _maxRadius = useRef(
    minRadius + Math.random() * (maxRadius - minRadius)
  );
  const radius = useRef(minRadius);
  const rotation = useRef(Math.random() * 360);
  const rotatingSpeed = useRef(Math.random() * 5);
  rotation.current += rotatingSpeed.current;
  radius.current = Math.min(_maxRadius.current, radius.current + 2);
  return (
    <g
      transform={`translate(${x.current}, ${y.current}) rotate(${rotation.current})`}
    >
      <path
        d={`M ${radius.current} 0
          A ${radius.current} ${
          radius.current
        }, 0, 0, 0, ${-radius.current} 0 Z`}
        fill={colorOne}
      />
      <path
        d={`M ${-radius.current} 0
           A ${radius.current} ${radius.current}, 0, 0, 0, ${
          radius.current
        } 0 Z`}
        fill={colorTwo}
      />
    </g>
  );
};
