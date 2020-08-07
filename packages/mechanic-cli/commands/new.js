const chalk = require("chalk");
const inquirer = require("inquirer");
const ora = require("ora");

const templateOptions = [
  { name: "Vanilla JS", type: "SVG" },
  { name: "React", type: "SVG" },
  { name: "D3", type: "SVG" },
  { name: "Vanilla JS", type: "Canvas" },
  { name: "p5.js", type: "Canvas" },
  { name: "THREE.js", type: "Canvas" },
];

const red = chalk.bgHex("#D70000").white;
const white = chalk.bgWhite.hex("#121212");
const blue = chalk.bgHex("#0000AF").white;

const DSI = [
  { word: "DESIGN", color: red },
  { word: "SYSTEMS", color: white },
  { word: "INTERNATIONAL", color: blue },
];

const mechanic = [
  { word: "MECHANIC", color: red },
  { word: "MECHANIC", color: blue },
];

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
  // console.log(frames);
  return frames;
};

const dsiSpinner = {
  interval: 80,
  frames: spinnerFrames(DSI),
};

const mechanicSpinner = {
  interval: 80,
  frames: spinnerFrames(mechanic),
};

// Not sure what params will recieve.
// TODO: Complete.
const generateProjectTemplate = async (answers) => {
  const spinner = ora({
    text: "Generating project template",
    spinner: dsiSpinner,
  }).start();

  // Simulated time passing.
  await new Promise((resolve) =>
    setTimeout(resolve, 5000 * (Math.random() + 1))
  );

  spinner.succeed();
};

// Not sure what params will recieve.
// TODO: Complete.
const installDependencies = async (answers) => {
  const spinner = ora({
    text: "Installing dependencies",
    spinner: mechanicSpinner,
  }).start();

  // Simulated time passing.
  await new Promise((resolve) =>
    setTimeout(resolve, 5000 * (Math.random() + 1))
  );

  spinner.succeed();
};

const _new = async () => {
  const answers = await inquirer.prompt([
    {
      name: "project",
      type: "input",
      message: "Name your project",
      default: "my-project",
    },
    {
      name: "template",
      type: "list",
      message: `Select template for your first design function
(you can always create more with \`mechanic new function\`)`,
      choices: templateOptions.map((option) => ({
        name: `${option.name} (${option.type})`,
        value: option,
      })),
    },
    {
      name: "functionName",
      type: "input",
      message: "Name your first function",
      default: "my-function",
    },
  ]);

  await generateProjectTemplate(answers);

  await installDependencies(answers);

  console.log(`Done! Now run \`cd ${answers.project}\` and \`npm run dev\``);
};

module.exports = _new;
