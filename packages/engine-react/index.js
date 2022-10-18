import React, { useState, useEffect } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Mechanic } from "@mechanic-design/core";

const root = document.getElementById("root");
const head = document.querySelector("head");

/**
 * Returns a drawLoop hook preloaded with the correctly setup version of
 * mechanic’s drawloop util.
 */
const makeDrawLoop =
  drawLoop =>
  (isPlaying = true) => {
    const [frameCount, setFrameCount] = useState(0);

    useEffect(() => {
      if (!isPlaying) {
        drawLoop.stop();
        return;
      }

      drawLoop.start(setFrameCount);

      return () => drawLoop.stop();
    }, [isPlaying]);

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

  mechanic.registerDoneCallback(async name => {
    if (!isPreview) {
      await mechanic.done(root.childNodes[0], { head });
      mechanic.download(name || functionName);
    }
  });

  const callbacks = mechanic.callbacksForEngine({
    drawLoop: () => {
      throw new Error(
        `drawLoop is not supported in engine react. Use the provided useDrawLoop hook instead.`
      );
    },
    useDrawLoop: makeDrawLoop(mechanic.drawLoop)
  });

  render(<Handler inputs={mechanic.values} {...callbacks} />, root);
  return mechanic;
};
