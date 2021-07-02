const fs = require("fs-extra");
const path = require("path");
const {
  spinners: { mechanicSpinner: spinner },
} = require("@designsystemsinternational/mechanic-utils");

const functionExampleOptions = require("./function-examples");
const functionTemplateOptions = require("./function-templates");

const getFunctionQuestions = (initialAnswers) => [
  {
    name: "base",
    type: "list",
    message: `Do you want to use a template or an example as a base for your first design function?`,
    default: initialAnswers.example
      ? "Example"
      : initialAnswers.template
      ? "Template"
      : null,
    choices: ["Template", "Example"],
  },
  {
    name: "template",
    type: "list",
    message: `Select template for your first design function`,
    default: initialAnswers.template,
    choices: Object.values(functionTemplateOptions).map((option) => ({
      name: `${option.name} (${option.type})`,
      value: option.dir,
    })),
    when: (answers) => answers.base === "Template",
  },
  {
    name: "example",
    type: "list",
    message: `Select example to use as base for your first design function`,
    default: initialAnswers.example,
    choices: Object.values(functionExampleOptions).map((option) => ({
      name: `${option.name} (${option.type})`,
      value: option.dir,
    })),
    when: (answers) => answers.base === "Example",
  },
  {
    name: "functionName",
    type: "input",
    message:
      "Name your first design function (you can always create more with `mechanic new function`)",
    default: "my-function",
  },
];

const generateFunctionTemplate = async (
  projectName,
  { base, template, example, functionName }
) => {
  spinner.start("Adding design function to project...");

  // Create design function folder
  const directory = path.resolve(projectName);
  const newFunctionDir = path.join(directory, "functions", functionName);
  await fs.mkdir(newFunctionDir);

  // Path of template directory to copy
  const baseFunctionDir = path.join(
    __dirname,
    base === "Template" ? "function-templates" : "function-examples",
    base === "Template"
      ? functionTemplateOptions[template].dir
      : functionExampleOptions[example].dir
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
};

module.exports = { generateFunctionTemplate, getFunctionQuestions };
