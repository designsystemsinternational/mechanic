import React, { Component } from "react";
import { Mechanic } from "mechanic-utils";
import { render, unmountComponentAtNode } from "react-dom";

const root = document.getElementById("root");

const run = (functionName, func, values, isPreview) => {
  unmountComponentAtNode(root);
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
      mechanic.download(functionName);
    }
  };
  render(<Handler {...mechanic.values} frame={onFrame} done={onDone} />, root);
};

export default run;
