import React, { useState } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Mechanic } from '@mechanic-design/core';

const root = document.getElementById('root');
const head = document.querySelector('head');

export const run = (functionName, func, values, config) => {
  const { isPreview } = config;
  unmountComponentAtNode(root);
  const mechanic = new Mechanic(func.settings, values, config);
  const Handler = func.handler;

  let shouldStopOnNextFrame = false;

  const onFrame = () => {
    if (shouldStopOnNextFrame) {
      finalizeFunction();
    } else {
      if (!isPreview) {
        mechanic.frame(root.childNodes[0], { head });
      }
    }
  };

  const onDone = () => (shouldStopOnNextFrame = true);

  const finalizeFunction = async (name) => {
    mechanic.drawLoop.stop();
    if (!isPreview) {
      await mechanic.done(root.childNodes[0], { head });
      mechanic.download(name || functionName);
    }
  };
  const onSetState = async (obj) => {
    mechanic.setState(obj);
  };

  const useDrawLoop = () => {
    const [frameCount, setFrameCount] = useState(0);
    const dispatchDrawLoop = mechanic.getDrawLoopHelper();

    dispatchDrawLoop(({ frameCount }) => {
      setFrameCount(frameCount);
    });

    return frameCount;
  };

  mechanic.drawLoop.maybeDisptach(({ frameCount }) => {
    render(
      <Handler
        inputs={mechanic.values}
        frameCount={frameCount}
        mechanic={{
          frame: onFrame,
          done: onDone,
          state: mechanic.functionState,
          setState: onSetState,
          useDrawLoop,
        }}
      />,
      root
    );

    if (mechanic.shouldUseControlledDrawloop()) {
      onFrame();
    }
  }, mechanic.shouldUseControlledDrawloop());

  return mechanic;
};
