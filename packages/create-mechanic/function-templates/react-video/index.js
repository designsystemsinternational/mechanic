import React, { useState, useEffect, useRef } from 'react';

// We pass in the frameCount variable, so Mechanic is now responsible for
// running the handler function on every frame. This makes it possible for
// us to create a timeline that when you scrub simply re-renders the handler
// by passing in the updated frameCount.
// For the React engine, this means that the component will render on every frame,
// but a solution is to pass the frameCount to a react-spring and then re-render with
// a memoed compomnent.
export const handler = ({ inputs, mechanic, frameCount }) => {
  const { width, height, text, color1, color2, radiusPercentage, turns } =
    inputs;
  const center = [width / 2, height / 2];
  const radius = ((height / 2) * radiusPercentage) / 100;
  const angle = useRef(0);

  useEffect(() => {
    if (angle.current < turns * 360) {
      // The next frame will not advance until the frame() function is called.
      // This makes it possible to load assets and other things before drawing the first frame.
      mechanic.frame();
      angle.current += 360 / 100;
    } else {
      // When done() is called, the design function will not run again.
      mechanic.done();
    }
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
          {text}
        </text>
      </g>
    </svg>
  );
};

export const inputs = {
  width: {
    type: 'number',
    default: 400
  },
  height: {
    type: 'number',
    default: 300
  },
  text: {
    type: 'text',
    default: 'mechanic'
  },
  color1: {
    type: 'color',
    model: 'hex',
    default: '#E94225'
  },
  color2: {
    type: 'color',
    model: 'hex',
    default: '#002EBB'
  },
  radiusPercentage: {
    type: 'number',
    default: 40,
    min: 0,
    max: 100,
    slider: true
  },
  turns: {
    type: 'number',
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
  engine: require('@mechanic-design/engine-react'),
  animated: true
};
