const fs = require("fs-extra");
const path = require("path");
const {
  spinners: { mechanicSpinner: spinner },
} = require("@designsystemsinternational/mechanic-utils");

const functionExampleOptions = require("./function-examples");
const functionTemplateOptions = require("./function-templates");
const content = require("./script-content");

const log = console.log;

const baseExists = (typeOfBaseUsed, base) => {
  if (typeOfBaseUsed === "template" && base in functionTemplateOptions)
    return true;
  if (typeOfBaseUsed === "example" && base in functionExampleOptions)
    return true;
  return false;
};

const getFunctionQuestions = (initialAnswers, config = {}) => [
  {
    name: "usesBase",
    type: "list",
    message: `Do you want to use a template or an example as a base for your first design function?`,
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
    message: `Select template for your first design function`,
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
    message: `Select example to use as base for your first design function`,
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
    message:
      "Name your first design function (you can always create more with `mechanic new function`)",
    default: initialAnswers.usesBase
      ? initialAnswers.base
      : initialAnswers.functionName || "my-function",
    validate: async (functionName) => {
      const exists = await fs.pathExists(
        path.resolve(config.functionsPath || "functions", functionName)
      );
      return !exists
        ? true
        : "Directory already exists. Enter name that doesn't exists.";
    },
    when: initialAnswers.noSkip || !initialAnswers.usesBase,
  },
];

const generateFunctionTemplate = async (
  projectName,
  { typeOfBaseUsed, base, functionName },
  config = {}
) => {
  spinner.start("Adding design function to project...");

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
    base === "Template"
      ? functionTemplateOptions[template].dir
      : typeOfBaseUsed === "Example"
      ? functionExampleOptions[example].dir
      : ""
  );

  // Add dependencies and copy files
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
    // Copy template design function with different names
    fs.copyFile(
      path.join(baseFunctionDir, "index.js"),
      path.join(newFunctionDir, "index.js")
    ),
  ]);

  // End UI spinner
  spinner.succeed(`Design function "${functionName}" added to project!`);
  log(content.functionCreationDetails(functionName));
  return newFunctionDir;
};

module.exports = {
  baseExists,
  generateFunctionTemplate,
  getFunctionQuestions,
};
