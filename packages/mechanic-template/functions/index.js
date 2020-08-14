import React, { Component } from "react";
import p5 from "p5";
import { render, unmountComponentAtNode } from "react-dom";
import { requireFunctions } from "../app/utils";
import { Mechanic, prepareValues } from "../app/utils/mechanic";
import { getTimeStamp } from "../app/utils";
const functions = requireFunctions();
const root = document.getElementById("root");

// Canvas
// -------------------------------------------------------------------------

const runCanvas = (functionName, values, isPreview) => {
  root.innerHTML = "";

  const func = functions[functionName];
  const mechanic = new Mechanic(func.params, func.settings, values);

  let isElAdded = false;

  const onFrame = el => {
    if (!isElAdded) {
      isElAdded = true;
      root.appendChild(el);
    }
    if (!isPreview) {
      mechanic.frame(el);
    }
  };

  const onDone = async el => {
    if (!isElAdded) {
      isElAdded = true;
      root.appendChild(el);
    }
    if (!isPreview) {
      await mechanic.done(el);
      mechanic.download(`${functionName}-${getTimeStamp()}`);
    }
  };

  func.handler(mechanic.values, { frame: onFrame, done: onDone });
};

// React
// -------------------------------------------------------------------------

const runReact = (functionName, values, isPreview) => {
  unmountComponentAtNode(root);
  const func = functions[functionName];
  const mechanic = new Mechanic(func.params, func.settings, values);
  const Handler = func.handler;
  const onFrame = () => {
    if (!isPreview) {
      mechanic.frame(root.childNodes[0]);
    }
  };
  const onDone = async () => {
    if (!isPreview) {
      await mechanic.done(root.childNodes[0]);
      mechanic.download(`${functionName}-${getTimeStamp()}`);
    }
  };
  render(<Handler {...mechanic.values} frame={onFrame} done={onDone} />, root);
};

// P5.js
// -------------------------------------------------------------------------

let p5Sketch;

const runP5 = (functionName, values, isPreview) => {
  if (p5Sketch) {
    p5Sketch.remove();
  }
  const func = functions[functionName];
  const mechanic = new Mechanic(func.params, func.settings, values);
  const onFrame = () => {
    if (!isPreview) {
      mechanic.frame(root.childNodes[0]);
    }
  };
  const onDone = async () => {
    p5Sketch.noLoop();
    if (!isPreview) {
      await mechanic.done(root.childNodes[0]);
      mechanic.download(`${functionName}-${getTimeStamp()}`);
    }
  };
  p5Sketch = new p5(
    sketch => func.handler(sketch, mechanic.values, { frame: onFrame, done: onDone }),
    root
  );
};

// SVG
// -------------------------------------------------------------------------

const runSVG = (functionName, values, isPreview) => {
  root.innerHTML = "";
  const func = functions[functionName];
  const mechanic = new Mechanic(func.params, func.settings, values);

  const onFrame = el => {
    root.innerHTML = "";
    root.appendChild(el);
    if (!isPreview) {
      mechanic.frame(el);
    }
  };

  const onDone = async el => {
    root.innerHTML = "";
    root.appendChild(el);
    if (!isPreview) {
      await mechanic.done(el);
      mechanic.download(`${functionName}-${getTimeStamp()}`);
    }
  };

  func.handler(mechanic.values, { frame: onFrame, done: onDone });
};

// This should be replaced by an automatic `require` based on the `settings.engine`
// in the design function settings.
const engines = {
  canvas: runCanvas,
  react: runReact,
  p5: runP5,
  svg: runSVG
};

let curEngine = null;
window.initEngine = engine => {
  if (engine !== curEngine) {
    console.log("Setting engine:", engine);
    // TODO: Kill existing sketch if running?
    window.run = (functionName, values, isPreview) => {
      // TODO: Do performance stats here?
      engines[engine](functionName, values, isPreview);
    };
    curEngine = engine;
  }
};
