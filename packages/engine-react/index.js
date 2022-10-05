import React, { useState } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Mechanic } from '@mechanic-design/core';

const root = document.getElementById('root');
const head = document.querySelector('head');

const makeDrawLoop = (dispatcher) => () => {
  const [frameCount, setFrameCount] = useState(0);

  dispatcher(({ frameCount }) => {
    setFrameCount(frameCount);
  });

  return frameCount;
};

export const run = (functionName, func, values, config) => {
  const { isPreview } = config;
  unmountComponentAtNode(root);
  const mechanic = new Mechanic(func.settings, values, config);
  const Handler = func.handler;

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
          }}
        />,
        root
      )
    );
  });

  return mechanic;
};
