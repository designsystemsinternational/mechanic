import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Mechanic } from "@designsystemsinternational/mechanic";

const root = document.getElementById("root");

export const run = (functionName, func, values, isPreview) => {
  unmountComponentAtNode(root);
  const mechanic = new Mechanic(func.params, func.settings, values);
  const Handler = func.handler;
  const onFrame = () => {
    if (!isPreview) {
      mechanic.frame(root.childNodes[0]);
    }
  };
  const onDone = async (name) => {
    if (!isPreview) {
      await mechanic.done(root.childNodes[0]);
      mechanic.download(name || functionName);
    }
  };
  render(<Handler {...mechanic.values} frame={onFrame} done={onDone} />, root);
  return mechanic;
};
