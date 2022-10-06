import React, { useState, useEffect, useMemo } from 'react';
import { getColors } from '../../utils/graphics';
import {
  computeBaseBricks,
  computeBlockGeometry,
  precomputeBlocks,
  getIndexModule,
} from '../../utils/blocks';
import { Unit } from '../../utils/blocks-components';
import { useLoadedOpentypeFont } from '../../utils/hooks';

export const handler = ({ inputs, mechanic }) => {
  const { width, height, logoWidth, logoRatio, durationInMs, fontMode } =
    inputs;
  const { frame, done } = mechanic;
  const duration = (durationInMs / 1000) * mechanic.fps;

  const [state, setState] = useState('loading');
  const font = useLoadedOpentypeFont(fontMode);

  const rows = 2;
  const cols = 13;
  const logoHeight = Math.floor((logoWidth / logoRatio) * rows);
  const words = ['DESIGN', 'SYSTEMS', 'INTERNATIONAL'];

  const frameCount = mechanic.useDrawLoop(state === 'playing');

  useEffect(() => {
    if (state === 'loading' && font) {
      setState('playing');
    }
  }, [font, state, setState]);

  const blockParams = useMemo(() => {
    if (!font) {
      return {
        blocksByIndex: [],
        blockConfigs: [],
      };
    }

    let colors = getColors('Random Flag');
    const blockGeometry = computeBlockGeometry(
      logoWidth,
      logoHeight,
      rows,
      cols
    );
    const baseBricks = computeBaseBricks(words, blockGeometry.fontSize, font);
    const blocksByIndex = precomputeBlocks(blockGeometry, baseBricks);

    const blockConfigs = [];
    let position = { x: 0, y: 0 };
    let brickOffset = 0;

    while (position.y < height) {
      const blockIndex = getIndexModule(brickOffset, blocksByIndex.length);
      const animation = {
        stepRate: (rows * cols * Math.floor(Math.random() * 4 + 1)) / duration,
        progress: 0,
        duration,
      };
      blockConfigs.push({ position, blockIndex, colors, animation });
      position = { ...position };
      if (position.x + blockGeometry.width < width) {
        position.x += blockGeometry.width;
        colors = getColors('Random Flag');
        brickOffset++;
      } else {
        position.x = position.x - width;
        position.y += blockGeometry.height;
      }
    }
    return { blocksByIndex, blockConfigs };
  }, [font]);

  useEffect(() => {
    if (state === 'playing') {
      if (frameCount >= duration) {
        done();
      }
      frame();
    }
  }, [frameCount, state, setState]);

  const { blockConfigs } = blockParams;
  return (
    <svg width={width} height={height}>
      {blockConfigs &&
        blockConfigs.map(({ position, blockIndex, colors, animation }) => (
          <Unit
            key={`${position.x}-${position.y}`}
            position={position}
            blocks={blockParams.blocksByIndex}
            blockIndex={blockIndex}
            colors={colors}
            animation={animation}
            runtime={frameCount}
          ></Unit>
        ))}
    </svg>
  );
};

export const inputs = {
  width: {
    type: 'number',
    default: 500,
    min: 100,
  },
  height: {
    type: 'number',
    default: 500,
    min: 100,
  },
  logoWidth: {
    type: 'number',
    default: 300,
    min: 10,
  },
  logoRatio: {
    type: 'number',
    default: 9,
    max: 20,
    slider: true,
    min: 6,
    step: 1,
  },
  durationInMs: {
    type: 'number',
    default: 5000,
    step: 500,
    min: 1000,
  },
  fontMode: {
    type: 'text',
    options: {
      'F Grotesk Thin': 'FGroteskThin-Regular.otf',
      'F Grotesk': 'FGrotesk-Regular.otf',
    },
    default: 'F Grotesk Thin',
  },
};

export const settings = {
  engine: require('@mechanic-design/engine-react'),
  mode: 'animation-custom',
  frameRate: 30,
};
