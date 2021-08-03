const path = require("path");
const inquirer = require("inquirer");
const {
  spinners: { mechanicSpinner: spinner },
} = require("@designsystemsinternational/mechanic-utils");
const {
  create,
  options,
  askToInstall,
} = require("@designsystemsinternational/create-mechanic");
const {
  generateFunctionTemplate,
  getFunctionQuestions,
  content,
} = require("@designsystemsinternational/create-mechanic/new-function");

const { getIsMechanicProject } = require("./utils");

const log = console.log;
const logSuccess = spinner.succeed;
const logFail = spinner.fail;
const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

const newFunctionCommand = async (argv) => {
  const isMechanicProject = getIsMechanicProject();
  if (!isMechanicProject) {
    logFail(content.notMechanicProjectError);
    return;
  }

  const config = require(path.resolve("mechanic.config.js"));

  const functionName = argv._[2];
  const template = argv.template || argv.t;
  const example = argv.example || argv.e;
  const typeOfBaseUsed = !!template
    ? "template"
    : !!example
    ? "example"
    : false;
  const base = !!template ? template : !!example ? example : null;

  log(content.welcome);
  if (typeOfBaseUsed) {
    log(content.useBaseNotice);
  }

  // Generate new functions directory and design function files and prompt if necessary
  const questions = getFunctionQuestions(
    {
      functionName,
      usesBase: typeOfBaseUsed,
      base,
    },
    config
  );
  const functionAnswers = await inquirer.prompt(questions);
  await sleep();

  const usesBase = functionAnswers.usesBase ?? functionQuestions[0].default;
  const finalBase =
    usesBase === "Template"
      ? functionAnswers.template ?? functionQuestions[1].default
      : usesBase === "Example"
      ? functionAnswers.example ?? functionQuestions[2].default
      : null;
  const finalFunctionName =
    functionAnswers.functionName ?? functionQuestions[3].default;
  await generateFunctionTemplate(
    ".",
    {
      typeOfBaseUsed: usesBase,
      base: finalBase,
      functionName: finalFunctionName,
    },
    config
  );

  // Install new dependencies
  const install = await askToInstall(".");

  // Done!
  log(content.doneAndNextStepsMessage(functionDir, install));
  log(content.bye);
};

module.exports = {
  command: "new",
  aliases: ["n"],
  desc: "Creates new mechanic project and design function",
  builder: (yargs) =>
    yargs.options(options).command({
      command: "function",
      aliases: ["f"],
      desc: "Creates new mechanic design function in existing mechanic project",
      builder: (yargs) => yargs,
      handler: newFunctionCommand,
    }),
  handler: (argv) => {
    argv._ = argv._.slice(1);
    create(argv);
  },
};
