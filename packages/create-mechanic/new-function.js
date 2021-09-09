const fs = require("fs-extra");
const path = require("path");
const {
  spinners: { mechanicSpinner: spinner },
} = require("@mechanic-design/utils");

const functionExampleOptions = require("./function-examples");
const functionTemplateOptions = require("./function-templates");
const content = require("./script-content");

const log = console.log;

// https://gist.github.com/lovasoa/8691344#gistcomment-3299018
const walk = (dir, fileCallback, directoryCallback) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      directoryCallback(file, filepath, stats);
      walk(filepath, fileCallback, directoryCallback);
    } else if (stats.isFile()) {
      fileCallback(file, filepath, stats);
    }
  });
};

const copyDirAndContents = (baseFunctionDir, newFunctionDir) => {
  const copyFile = (_, filepath) => {
    if (path.join(baseFunctionDir, "dependencies.json") === filepath) return;
    const relativePath = path.relative(baseFunctionDir, filepath);
    fs.copyFileSync(filepath, path.join(newFunctionDir, relativePath));
  };
  const copyDir = (_, filepath) => {
    const relativePath = path.relative(baseFunctionDir, filepath);
    fs.mkdirSync(path.join(newFunctionDir, relativePath));
  };
  walk(baseFunctionDir, copyFile, copyDir);
};

const baseExists = (typeOfBaseUsed, base) => {
  if (typeOfBaseUsed === "template" && base in functionTemplateOptions)
    return true;
  if (typeOfBaseUsed === "example" && base in functionExampleOptions)
    return true;
  return false;
};

const directoryExists = async (dirPath) => await fs.pathExists(dirPath);

const getFunctionQuestions = (initialAnswers, config = {}) => [
  {
    name: "usesBase",
    type: "list",
    message: content.functionBaseQuestion(config.isFirst),
    default:
      initialAnswers.usesBase === "example"
        ? "Example"
        : initialAnswers.usesBase === "template"
        ? "Template"
        : null,
    choices: ["Template", "Example", "Neither"],
    when: initialAnswers.noSkip || !initialAnswers.usesBase,
  },
  {
    name: "template",
    type: "list",
    message: content.functionTemplateQuestion(config.isFirst),
    default:
      initialAnswers.usesBase === "template" ? initialAnswers.base : null,
    choices: Object.values(functionTemplateOptions).map((option) => ({
      name: `${option.name} (${option.type})`,
      value: option.dir,
    })),
    when: (answers) =>
      !initialAnswers.usesBase && answers.usesBase === "Template",
  },
  {
    name: "example",
    type: "list",
    message: content.functionExampleQuestion(config.isFirst),
    default: initialAnswers.usesBase === "example" ? initialAnswers.base : null,
    choices: Object.values(functionExampleOptions).map((option) => ({
      name: `${option.name} (${option.type})`,
      value: option.dir,
    })),
    when: (answers) =>
      !initialAnswers.usesBase && answers.usesBase === "Example",
  },
  {
    name: "functionName",
    type: "input",
    message: content.functionNameQuestion(config.isFirst),
    default: initialAnswers.usesBase
      ? initialAnswers.base
      : initialAnswers.functionName || "my-function",
    validate: async (functionName) => {
      const exists = await fs.pathExists(
        path.resolve(config.functionsPath || "functions", functionName)
      );
      return !exists ? true : content.functionNameExistsError;
    },
    when: initialAnswers.noSkip || !initialAnswers.usesBase,
  },
];

const generateFunctionTemplate = async (
  projectName,
  { typeOfBaseUsed, base, functionName },
  config = {}
) => {
  spinner.start(content.generateFunctionStart);

  // Create design function folder
  const directory = path.resolve(projectName);
  const newFunctionDir = path.join(
    directory,
    config.functionsPath || "functions",
    functionName
  );
  await fs.mkdir(newFunctionDir);

  // Path of template directory to copy
  const baseFunctionDir = path.join(
    __dirname,
    typeOfBaseUsed === "Template"
      ? "function-templates"
      : typeOfBaseUsed === "Example"
      ? "function-examples"
      : "function-blank",
    typeOfBaseUsed === "Template"
      ? functionTemplateOptions[base].dir
      : typeOfBaseUsed === "Example"
      ? functionExampleOptions[base].dir
      : ""
  );

  // Add dependencies and copy basic files
  await Promise.all([
    (async () => {
      const packageObj = JSON.parse(
        await fs.readFile(path.join(directory, "package.json"), "utf8")
      );
      const baseDependencies = JSON.parse(
        await fs.readFile(
          path.join(baseFunctionDir, "dependencies.json"),
          "utf8"
        )
      );
      // Add dependencies
      for (const depType in baseDependencies) {
        if (!packageObj[depType]) {
          packageObj[depType] = {};
        }
        for (const dep in baseDependencies[depType]) {
          packageObj[depType][dep] = baseDependencies[depType][dep];
        }
      }
      // Write the resulting package
      await fs.writeFile(
        path.join(directory, "package.json"),
        JSON.stringify(packageObj, null, 2)
      );
    })(),
  ]);
  // Copy all files in base dir
  copyDirAndContents(baseFunctionDir, newFunctionDir);

  spinner.succeed(content.generateFunctionSuccess(functionName));
  log(content.functionCreationDetails(functionName));
  return newFunctionDir;
};

module.exports = {
  baseExists,
  directoryExists,
  generateFunctionTemplate,
  getFunctionQuestions,
  copyDirAndContents,
  content: {
    notMechanicProjectError: content.notMechanicProjectError,
    welcome: content.welcomeNewFunction,
    useBaseNotice: content.useBaseNotice,
    baseExist: content.baseExist,
    baseDoesNotExist: content.baseDoesNotExist,
    directoryAlreadyExist: content.directoryAlreadyExist,
    doneAndNextStepsMessage: content.newFunctionNextStepsMessage,
    bye: content.bye,
  },
};
