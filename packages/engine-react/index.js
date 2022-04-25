import React, { useRef, useState, useEffect } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Mechanic } from "@mechanic-design/core";

const root = document.getElementById("root");
const head = document.querySelector("head");

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
    if (!isPreview) {
      await mechanic.done(root.childNodes[0], { head });
      mechanic.download(name || functionName);
    }
  };
  const onSetState = async (obj) => {
    mechanic.setState(obj);
  };

  render(
    <Handler
      inputs={mechanic.values}
      mechanic={{
        frame: onFrame,
        done: onDone,
        state: mechanic.functionState,
        setState: onSetState,
        frameRate: mechanic.settings.frameRate,
      }}
    />,
    root
  );
  return mechanic;
};

/**
 * Reactive version of the throttled drawloop.
 *
 * @param ref to a boolean
 * @param target framerate
 */
export const useDrawLoop = (isPlaying, fps = 60) => {
  const fpsInterval = 1000 / fps;
  const epsilon = 5;

  const raf = useRef();
  const [frameCount, setFrameCount] = useState(0);

  // FPS Throttling
  // @see https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
  useEffect(() => {
    let now;
    let then = Date.now();
    let elapsed;

    cancelAnimationFrame(raf.current);

    if (!isPlaying) {
      return;
    }

    const draw = () => {
      raf.current = requestAnimationFrame(draw);

      now = Date.now();
      elapsed = now - then;

      // Same epsilon logic as in core/mechanic-utils.
      // See there for an explanation.
      if (elapsed >= fpsInterval - epsilon) {
        then = now - (elapsed % fpsInterval);

        setFrameCount((cur) => cur + 1);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(raf.current);
    };
  }, [isPlaying]);

  return frameCount;
};
