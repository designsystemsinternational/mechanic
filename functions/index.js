import React, { Component } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { requireFunctions } from "../app/utils";
import { Mechanic, prepareValues } from "../app/utils/mechanic";
import { getTimeStamp } from "../app/utils";
const functions = requireFunctions();
const root = document.getElementById("root");

// This file runs every time a function is selected in the UI.
// It is specific to the `returns` value, because each library requires its
// own handling (e.g. React vs Vue).

window.preview = (functionName, values) => {
  unmountComponentAtNode(root);
  const func = functions[functionName];
  const mechanic = new Mechanic(func.params, func.settings, values);
  const Handler = func.handler;
  render(<Handler {...mechanic.values} />, root);
};

window.export = (functionName, values) => {
  unmountComponentAtNode(root);

  const func = functions[functionName];
  const mechanic = new Mechanic(func.params, func.settings, values);

  const onFrame = () => {
    mechanic.frame(root.childNodes[0]);
  };

  const onDone = async () => {
    await mechanic.done(root.childNodes[0]);
    mechanic.download(`${functionName}-${getTimeStamp()}`);
  };

  // TODO: Could we NOT render this to DOM?
  // TODO: Disable requestAnimationFrame
  const Handler = func.handler;
  render(<Handler frame={onFrame} done={onDone} {...mechanic.values} />, root);
};
