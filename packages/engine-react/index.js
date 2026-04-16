import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Mechanic } from "@mechanic-design/core";

const root = document.getElementById("root");
const head = document.querySelector("head");
/**
 * Once you call root.unmount you cannot call root.render again on the same 
 * root. Attempting to call root.render on an unmounted root will throw a 
 * “Cannot update an unmounted root” error. 
 *
 * However, you can create a new root for the same DOM node after the previous 
 * root for that node has been unmounted. Which is why we keep the react root
 * in a global variable, so we can create a new one if needed.
 */
let reactRoot;

/**
 * Returns a drawLoop hook preloaded with the correctly setup version of
 * mechanic’s drawloop util.
 */
const makeDrawLoop =
  drawLoop =>
    (isPlaying = true) => {
      const [animationProgress, setAnimationProgress] = useState({
        frameCount: 0,
        timestamp: 0
      });

      useEffect(() => {
        if (!isPlaying) {
          drawLoop.stop();
          return;
        }

        drawLoop.start(setAnimationProgress);

        return () => drawLoop.stop();
      }, [isPlaying]);

      return animationProgress;
    };

export const run = (functionName, func, values, config) => {
  const { isPreview } = config;

  if (reactRoot) {
    reactRoot.unmount();
  }

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

  const callbacks = mechanic.callbacksForDesignFunction({
    drawLoop: () => {
      throw new Error(
        `drawLoop is not supported in engine react. Use the provided useDrawLoop hook instead.`
      );
    },
    useDrawLoop: makeDrawLoop(mechanic.drawLoop)
  });

  reactRoot = createRoot(root);
  reactRoot.render(
    <Handler inputs={mechanic.values} {...callbacks} isPreview={isPreview} />
  );

  return mechanic;
};
