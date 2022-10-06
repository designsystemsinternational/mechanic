import React, { useState, useEffect } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Mechanic } from '@mechanic-design/core';

const root = document.getElementById('root');
const head = document.querySelector('head');

const makeDrawLoop =
  (dispatcher) =>
  (isPlaying = true) => {
    const [frameCount, setFrameCount] = useState(0);

    useEffect(() => {
      if (!isPlaying) return;
      dispatcher(({ frameCount }) => {
        setFrameCount(frameCount);
      });
    }, [isPlaying, dispatcher]);

    return frameCount;
  };

export const run = (functionName, func, values, config) => {
  const { isPreview } = config;
  unmountComponentAtNode(root);
  const mechanic = new Mechanic(func.settings, values, config);
  const Handler = func.handler;

  const memoMock = () => {
    throw new Error(
      `mechanic.memo is not allowed in engine-react. Use React’s built-in useMemo hook instead`
    );
  };

  mechanic.registerFrameCallback(() => {
    if (!isPreview) {
      mechanic.frame(root.childNodes[0], { head });
    }
  });

  mechanic.registerFinalizeCallback(async () => {
    mechanic.drawLoop.stop();
    if (!isPreview) {
      await mechanic.done(root.childNodes[0], { head });
      mechanic.download(name || functionName);
    }
  });

  mechanic.dispatch(async ({ frameCount }) => {
    const mechanicParams = mechanic.getCallbacksForHandler();

    mechanic.maybeAddFrame(
      render(
        <Handler
          inputs={mechanic.values}
          frameCount={frameCount}
          mechanic={{
            ...mechanicParams,
            useDrawLoop: makeDrawLoop(mechanicParams.draw),
            memo: () => memoMock.call(null),
          }}
        />,
        root
      )
    );
  });

  return mechanic;
};
