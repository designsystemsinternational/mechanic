// This file is for demo purposes on the deploy preview only
// This will be deleted before the final PR review is happening
//
// TODO: DELETE
import {
  transition,
  namedEasings,
  namedDirections,
} from "@mechanic-design/transition";

export const handler = async ({ inputs, frame, done, getCanvas, drawLoop }) => {
  const { width, height, easing, direction, iterationCount, duration } = inputs;

  const { ctx } = getCanvas(width, height);
  const w = transition({
    from: 0,
    to: width,
    duration: duration,
    easing: easing,
    iterationCount: iterationCount,
    direction: direction
  });

  drawLoop(({ timestamp }) => {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, w(timestamp), height);

    if (timestamp < 10) {
      frame();
    } else {
      done();
    }
  });
};

export const inputs = {
  width: {
    type: "number",
    default: 500
  },
  height: {
    type: "number",
    default: 500
  },
  easing: {
    type: "text",
    options: namedEasings,
    default: namedEasings[0]
  },
  direction: {
    type: "text",
    options: namedDirections,
    default: namedDirections[0]
  },
  iterationCount: {
    type: "number",
    default: 1,
    min: 1,
    max: 1000,
    slider: true,
  },
  duration: {
    type: "number",
    label: "Animation Iteration Duration (in seconds)",
    min: 0,
    max: 10,
    slider: true,
    step: 0.05,
    default: 1,
  }
};

export const settings = {
  engine: require("@mechanic-design/engine-canvas"),
  animated: true
};
