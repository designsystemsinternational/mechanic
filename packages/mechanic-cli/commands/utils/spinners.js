const chalk = require("chalk");

const spinnerFrames = (settings) => {
  let length = 0;
  let letterArray = [];
  settings.forEach(({ word, color }) => {
    length += word.length;
    [...word].forEach((c) => letterArray.push(color(c)));
  });
  letterArray = letterArray.concat(letterArray);
  const frames = [];
  for (let index = 0; index < length; index++) {
    const subLetters = letterArray.slice(index, index + length / 2 + 1);
    frames.push(subLetters.reduce((acc, curr) => acc + curr, ""));
  }
  return frames;
};

const red = chalk.bgHex("#D70000").white;
const white = chalk.bgWhite.hex("#121212");
const blue = chalk.bgHex("#0000AF").white;

const dsi = [
  { word: "DESIGN", color: red },
  { word: "SYSTEMS", color: white },
  { word: "INTERNATIONAL", color: blue },
];

const dsiSpinner = {
  interval: 80,
  frames: spinnerFrames(dsi),
};

const mechanic = [
  { word: "MECHANIC", color: red },
  { word: "MECHANIC", color: blue },
];

const mechanicSpinner = {
  interval: 80,
  frames: spinnerFrames(mechanic),
};

const success = chalk.green.bold;

module.exports = {
  dsiSpinner,
  mechanicSpinner,
  success,
};
