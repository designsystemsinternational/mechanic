const path = require("path");
const inquirer = require("inquirer");
const {
  spinners: { mechanicSpinner: spinner },
} = require("@mechanic-design/utils");
const { create, options, askToInstall } = require("create-mechanic");
const {
  baseExists,
  directoryExists,
  generateFunctionTemplate,
  getFunctionQuestions,
  content,
} = require("create-mechanic/new-function");

const { getIsMechanicProject } = require("./utils");

const log = console.log;
const logSuccess = spinner.succeed;
const logFail = spinner.fail;
const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));
const nullishCoalescingOp = (arg1, arg2) => (arg1 != null ? arg1 : arg2);

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

  // Check that base exists and can be created
  if (typeOfBaseUsed) {
    if (!baseExists(typeOfBaseUsed, base)) {
      logFail(content.baseDoesNotExist(typeOfBaseUsed, base));
      return;
    } else {
      logSuccess(content.baseExist(typeOfBaseUsed, base));
    }
    const alreadyExists = await directoryExists(
      path.resolve("functions", base)
    );
    if (alreadyExists) {
      logFail(content.directoryAlreadyExist(typeOfBaseUsed, base));
      return;
    }
  }

  // Generate new functions directory and design function files and prompt if necessary
  const questions = getFunctionQuestions(
    {
      functionName,
      usesBase: typeOfBaseUsed,
      base,
    },
    { ...config, isFirst: false }
  );
  const functionAnswers = await inquirer.prompt(questions);
  await sleep();

  const usesBase = nullishCoalescingOp(
    functionAnswers.usesBase,
    questions[0].default
  );
  const finalBase =
    usesBase === "Template"
      ? nullishCoalescingOp(functionAnswers.template, questions[1].default)
      : usesBase === "Example"
      ? nullishCoalescingOp(functionAnswers.example, questions[2].default)
      : null;
  const finalFunctionName = nullishCoalescingOp(
    functionAnswers.functionName,
    questions[3].default
  );
  const functionDir = await generateFunctionTemplate(
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
