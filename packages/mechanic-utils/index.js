const chalk = require("chalk");
const ora = require("ora");

const spinnerFrames = settings => {
  let length = 0;
  let letterArray = [];
  settings.forEach(({ word, color }) => {
    length += word.length;
    [...word].forEach(c => letterArray.push(color(c)));
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
  { word: "INTERNATIONAL", color: blue }
];

const dsiSpinnerSetting = {
  interval: 80,
  frames: spinnerFrames(dsi)
};

const mechanic = [
  { word: "MECHANIC", color: red },
  { word: "MECHANIC", color: blue }
];

const mechanicSpinnerSettings = {
  interval: 80,
  frames: spinnerFrames(mechanic)
};

const success = chalk.green.bold;
const fail = chalk.red.bold;

const dsiSpinner = ora({ spinner: dsiSpinnerSetting });
const mechanicSpinner = ora({ spinner: mechanicSpinnerSettings });

mechanicSpinner.succeed = text =>
  mechanicSpinner.stopAndPersist({ text, symbol: chalk.bgGreen(" ✔ ") });
mechanicSpinner.fail = text => mechanicSpinner.stopAndPersist({ text, symbol: chalk.bgRed(" ✖ ") });
mechanicSpinner.warn = text =>
  mechanicSpinner.stopAndPersist({ text, symbol: chalk.bgYellow(" ⚠ ") });

const mechanicLogo = `${red("MECHANIC")}\n${blue("MECHANIC")}`;
const mechanicLogoInverse = `${blue("MECHANIC")}\n${red("MECHANIC")}`;

const dsiLogo = `${white("TIONAL")}${red("DESIGN")}${blue("S")}\n${blue("YSTEMS")}${white(
  "INTERNA"
)}`;

module.exports = {
  spinners: {
    dsiSpinner,
    mechanicSpinner
  },
  colors: {
    success,
    fail,
    bgRed: red,
    bgBlue: blue
  },
  logo: {
    dsi: dsiLogo,
    mechanic: mechanicLogo,
    mechanicInverse: mechanicLogoInverse
  }
};
