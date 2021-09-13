const fs = require("fs-extra");
const execa = require("execa");
const path = require("path");
const {
  spinners: { mechanicSpinner: spinner },
} = require("@mechanic-design/utils");

const content = require("./script-content");

const log = console.log;
const projectTemplateDir = path.join(__dirname, "project-template");

const getProjectQuestion = (initialAnswers) => [
  {
    name: "project",
    type: "input",
    message: content.projectNameQuestion,
    default: initialAnswers.usesBase
      ? initialAnswers.base
      : initialAnswers.project || "my-project",
    when:
      initialAnswers.noSkip ||
      (!initialAnswers.usesBase && !initialAnswers.project),
    validate: async (project) => {
      const exists = await fs.pathExists(path.resolve(project));
      return !exists ? true : content.projectNameExistsError;
    },
  },
];
const confirmDFQuestion = [
  {
    name: "confirmContinue",
    type: "confirm",
    message: content.confirmContinueQuestion,
    default: true,
  },
];
const confirmInstallQuestion = [
  {
    name: "install",
    type: "confirm",
    message: content.confirmInstallQuestion,
    default: true,
  },
];

const generateProjectTemplate = async (projectName, typeOfBaseUsed) => {
  spinner.start(content.generateProjectStart);

  // Make new directories
  const directory = path.resolve(projectName);
  await fs.mkdir(directory); // Main
  await fs.mkdir(path.join(directory, "functions")); // Functions folder

  // Copying content promises
  await Promise.all([
    // Copy array of files that get duplicated without change
    ...["mechanic.config.js", "README.md"].map((filename) =>
      fs.copyFile(
        path.join(projectTemplateDir, filename),
        path.join(directory, filename.replace(/^_/, "."))
      )
    ),
    // Modifications
    (async () => {
      const packageJson = await fs.readJson(
        path.join(projectTemplateDir, "package.json"),
        "utf8"
      );
      const packageObj = {
        name: projectName, // Adds name of project
        ...packageJson,
      };
      // Write the resulting package
      await fs.writeFile(
        path.join(directory, "package.json"),
        JSON.stringify(packageObj, null, 2)
      );
    })(),
  ]);

  spinner.succeed(content.generateProjectSuccess(typeOfBaseUsed, projectName));
  log(content.projectContents(path.dirname(directory)));
};

const installDependencies = async (projectName) => {
  // Project directory
  const cwd = path.resolve(projectName);

  try {
    spinner.start(content.installTry("yarn"));
    // Install with yarn
    await execa("yarn", ["install"], { cwd });
    // End success UI spinner
    spinner.succeed(content.installSucceed("yarn"));
    return "yarn";
  } catch (err) {
    if (err.failed) {
      // Notify failure
      spinner.warn(content.installFailed("yarn"));
      spinner.start(content.installTry("npm"));
      try {
        // Install with npm
        await execa("npm", ["install"], { cwd });
        // End success UI spinner
        spinner.succeed(content.installSucceed("npm"));
        return "npm";
      } catch (npmErr) {
        // Notify failure
        spinner.fail(content.installFail);
      }
    }
  }
};

module.exports = {
  getProjectQuestion,
  confirmDFQuestion,
  confirmInstallQuestion,
  generateProjectTemplate,
  installDependencies,
};
