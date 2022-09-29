import React, { useEffect, useRef } from 'react';

export const handler = ({ inputs, mechanic }) => {
  const { width, height, color1, color2, radiusPercentage, turns } = inputs;

  const center = [width / 2, height / 2];
  const radius = ((height / 2) * radiusPercentage) / 100;
  const angle = useRef(0);

  // Achieving an event based (n turns of the circle) animation logic by using
  // the provided drawLoop hook.
  const frameCount = mechanic.useDrawLoop();

  useEffect(() => {
    if (angle.current >= 360 * turns) {
      mechanic.done();
    }
    angle.current += 360 / 20;
    mechanic.frame();
  }, [frameCount]);

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
          {angle.current}
        </text>
      </g>
    </svg>
  );
};

export const inputs = {
  width: {
    type: 'number',
    default: 400,
  },
  height: {
    type: 'number',
    default: 300,
  },
  color1: {
    type: 'color',
    model: 'hex',
    default: '#E94225',
  },
  color2: {
    type: 'color',
    model: 'hex',
    default: '#002EBB',
  },
  radiusPercentage: {
    type: 'number',
    default: 40,
    min: 0,
    max: 100,
    slider: true,
  },
  turns: {
    type: 'number',
    default: 3,
  },
};

export const presets = {
  medium: {
    width: 800,
    height: 600,
  },
  large: {
    width: 1600,
    height: 1200,
  },
};

export const settings = {
  engine: require('@mechanic-design/engine-react'),
  mode: 'animation-custom',
  frameRate: 30,
};
