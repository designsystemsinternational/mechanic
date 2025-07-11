const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const {
  spinners: { mechanicSpinner: spinner }
} = require("@mechanic-design/utils");

const content = require("./script-content");
const {
  getProjectQuestion,
  confirmDFQuestion,
  confirmInstallQuestion,
  installationMethodQuestion,
  generateProjectTemplate,
  installDependencies,
  tryGitInit,
  checkLockFile,
  confirmGitQuestion
} = require("./new-project");
const {
  baseExists,
  directoryExists,
  generateFunctionTemplate,
  getFunctionQuestions
} = require("./new-function");

const log = console.log;
const logSuccess = spinner.succeed;
const logFail = spinner.fail;
const sleep = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));
const nullishCoalescingOp = (arg1, arg2) => (arg1 != null ? arg1 : arg2);

const askToInstall = async projectName => {
  // Project directory
  const cwd = path.resolve(projectName);

  // List out dependencies being installed
  const packageJsonPath = path.join(cwd, "package.json");
  const packageObj = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
  log(content.installingDependenciesMessage);
  for (const depType of ["devDependencies", "dependencies"]) {
    for (const dep in packageObj[depType]) {
      log(content.dependencyItem(dep));
    }
  }
  log();

  // Install dependencies in new project directory
  const { install } = await inquirer.prompt(confirmInstallQuestion);
  await sleep();

  if (install) {
    let installingMethod = await checkLockFile(projectName);
    if (!installingMethod) {
      installingMethod = (await inquirer.prompt(installationMethodQuestion))
        .installingMethod;
      await sleep();
    }

    const success = await installDependencies(projectName, installingMethod);
    return { success, installingMethod };
  }
  return install;
};

const askToInitGit = async projectName => {
  // Install dependencies in new project directory
  const { gitInit } = await inquirer.prompt(confirmGitQuestion);
  await sleep();

  if (gitInit) {
    const success = await tryGitInit(projectName);
    return { success };
  }
  return gitInit;
};

const command = async argv => {
  const project = argv._[0];
  const template = argv.template || argv.t;
  const example = argv.example || argv.e;
  const typeOfBaseUsed = !!template
    ? "template"
    : !!example
    ? "example"
    : false;
  const base = !!template ? template : !!example ? example : null;

  // Welcome
  log(content.welcome);
  if (!typeOfBaseUsed) {
    log(content.questionnaireDescription);
  } else {
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
    const potentialFolderName = nullishCoalescingOp(project, base);
    const alreadyExists = await directoryExists(
      path.resolve(potentialFolderName)
    );
    if (alreadyExists) {
      logFail(
        content.directoryAlreadyExist(typeOfBaseUsed, potentialFolderName)
      );
      return;
    }
  }

  // Generate project and prompt if necessary
  const projectQuestion = getProjectQuestion({
    project,
    usesBase: typeOfBaseUsed,
    base
  });
  const answers = await inquirer.prompt(projectQuestion);
  await sleep();
  const projectName = nullishCoalescingOp(
    answers.project,
    nullishCoalescingOp(project, "my-project")
  );
  await generateProjectTemplate(projectName, typeOfBaseUsed);

  // Explain design functions and confirm
  let skipFunctions = false;
  if (!typeOfBaseUsed) {
    log(content.designFunctionDescription);
    const { confirmContinue } = await inquirer.prompt(confirmDFQuestion);
    await sleep();
    if (confirmContinue) {
      log();
      log(content.designFunctionBasesDescription);
    } else {
      skipFunctions = true;
    }
  }
  if (!skipFunctions) {
    // Generate new functions directory and design function files and prompt if necessary
    const functionQuestions = getFunctionQuestions({
      usesBase: typeOfBaseUsed,
      base
    });
    const functionAnswers = await inquirer.prompt(functionQuestions);
    await sleep();
    const usesBase = nullishCoalescingOp(
      functionAnswers.usesBase,
      functionQuestions[0].default
    );
    const finalBase =
      usesBase === "Template"
        ? nullishCoalescingOp(
            functionAnswers.template,
            functionQuestions[1].default
          )
        : usesBase === "Example"
        ? nullishCoalescingOp(
            functionAnswers.example,
            functionQuestions[2].default
          )
        : null;
    const functionName = nullishCoalescingOp(
      functionAnswers.functionName,
      functionQuestions[3].default
    );
    const config = require(path.join(
      path.resolve(projectName),
      "mechanic.config.js"
    ));
    await generateFunctionTemplate(
      projectName,
      {
        typeOfBaseUsed: usesBase,
        base: finalBase,
        functionName
      },
      config
    );
  }

  // Install dependencies in new project directory
  const install = await askToInstall(projectName);

  // Try initializing git repository
  await askToInitGit(projectName);

  // Done!
  log(content.doneAndNextStepsMessage(projectName, install));
  log(content.bye);
};

const commandOptions = {
  template: {
    alias: "t",
    type: "string",
    description:
      "Use simple design functions we created to show how to use Mechanic with specific web technologies."
  },
  example: {
    alias: "e",
    type: "string",
    description:
      "Use more complicated design functions we created to show how to use Mechanic to tackle some common use cases."
  }
};

module.exports = {
  create: command,
  options: commandOptions,
  askToInstall
};
