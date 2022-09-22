import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Mechanic } from '@mechanic-design/core';

const root = document.getElementById('root');
const head = document.querySelector('head');

export const run = (functionName, func, values, config) => {
  const { isPreview } = config;
  unmountComponentAtNode(root);
  const mechanic = new Mechanic(func.settings, values, config);
  const Handler = func.handler;
  const onFrame = () => {
    if (!isPreview) {
      mechanic.frame(root.childNodes[0], { head });
    }
  };
  const onDone = async (name) => {
    mechanic.drawLoop.stop();
    if (!isPreview) {
      await mechanic.done(root.childNodes[0], { head });
      mechanic.download(name || functionName);
    }
  };
  const onSetState = async (obj) => {
    mechanic.setState(obj);
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
        }}
      />,
      root
    );
  }, func.settings.animated);

  return mechanic;
};
