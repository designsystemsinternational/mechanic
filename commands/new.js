const chalk = require("chalk");
const inquirer = require("inquirer");
const ora = require("ora");

const templateOptions = [
  {name: 'Vanilla JS', type: 'SVG'},
  {name: 'React', type: 'SVG'},
  {name: 'D3', type: 'SVG'},
  {name: 'Vanilla JS', type: 'Canvas'},
  {name: 'p5.js', type: 'Canvas'},
  {name: 'THREE.js', type: 'Canvas'},
];

const generateProjectTemplate = (answers) => {
  const spinner = ora("Generating project template").start();
  
  spinner.succeed();
};

const installDependencies = (answers) => {
  const spinner = ora("Installing dependencias").start();
  
  spinner.succeed();
};

const mechanicSignature = () => {
  const blue = chalk.bgHex("#0000AF").white;
  const red = chalk.bgHex("#D70000").white;
  const white = chalk.bgWhite.hex("#121212");
  console.log(blue("IONAL") + red("DESIGN") + white("SY"));
  console.log(white("STEMS") + blue("INTERNAT"));
};

const _new = async () => {

  const answers = await inquirer.prompt([
    {
      name: "project",
      type: "input",
      message: "Project name?",
      default: "my-project"
    },
    {
      name: "template",
      type: "list",
      message: `Select template for your first design function
(you can always create more with mechanic new function)`,
      choices: templateOptions.map((option) => ({
        name: `${option.name} (${option.type})`, value: option
      }))
    },
    {
      name: "functionName",
      type: "input",
      message: "Name your first function",
      default: "my-function"
    }
  ]);

  generateProjectTemplate(answers);

  installDependencies(answers);

  console.log(`Done! Now run \`cd ${answers.project}\` and \` npm run dev\``);
  mechanicSignature();
};

module.exports = _new;