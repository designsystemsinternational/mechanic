const fs = require("fs-extra");
const execa = require("execa");
const path = require("path");
const {
  spinners: { mechanicSpinner: spinner }
} = require("@mechanic-design/utils");

const content = require("./script-content");

const log = console.log;
const projectTemplateDir = path.join(__dirname, "project-template");

const getProjectQuestion = initialAnswers => [
  {
    name: "project",
    type: "input",
    message: content.projectNameQuestion,
    default: initialAnswers.usesBase
      ? initialAnswers.base
      : initialAnswers.project || "my-project",
    when: initialAnswers.noSkip || !initialAnswers.project,
    validate: async project => {
      const exists = await fs.pathExists(path.resolve(project));
      return !exists ? true : content.projectNameExistsError;
    }
  }
];
const confirmDFQuestion = [
  {
    name: "confirmContinue",
    type: "confirm",
    message: content.confirmContinueQuestion,
    default: true
  }
];
const confirmInstallQuestion = [
  {
    name: "install",
    type: "confirm",
    message: content.confirmInstallQuestion,
    default: true
  }
];

const installationMethodQuestion = [
  {
    name: "installingMethod",
    type: "list",
    message: content.installationMethodQuestion,
    default: "npm",
    choices: ["npm", "yarn"]
  }
];

const confirmGitQuestion = [
  {
    name: "gitInit",
    type: "confirm",
    message: content.confirmGitInitQuestion,
    default: true
  }
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
    ...["mechanic.config.js", "README.md", "_gitignore"].map(filename =>
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
        ...packageJson
      };
      // Write the resulting package
      await fs.writeFile(
        path.join(directory, "package.json"),
        JSON.stringify(packageObj, null, 2)
      );
    })()
  ]);

  spinner.succeed(content.generateProjectSuccess(typeOfBaseUsed, projectName));
  log();
  log(content.projectContents(path.dirname(directory)));
};

const checkLockFile = async (projectName, installingMethod) => {
  // Project directory
  const cwd = path.resolve(projectName);

  // Try with npm
  const npmLockExists = await fs.pathExists(
    path.join(cwd, "package-lock.json")
  );
  if (npmLockExists) return "npm";

  // Try with yarn
  const yarnLockExists = await fs.pathExists(path.join(cwd, "yarn.lock"));
  if (yarnLockExists) return "yarn";
};

const installDependencies = async (projectName, installingMethod) => {
  // Project directory
  const cwd = path.resolve(projectName);

  try {
    spinner.start(content.installTry(installingMethod));
    // Install
    await execa(installingMethod, ["install"], { cwd });
    // End success UI spinner
    spinner.succeed(content.installSucceed(installingMethod));
    return true;
  } catch (err) {
    if (err.failed) {
      // Notify failure
      spinner.fail(content.installFailed(installingMethod));
    }
    return false;
  }
};

async function isInGitRepository(cwd) {
  try {
    await execa("git", ["rev-parse", "--is-inside-work-tree"], { cwd });
    return true;
  } catch (_) {}
  return false;
}

async function isInMercurialRepository(cwd) {
  try {
    await execa("hg", ["--cwd", ".", "root"], { cwd });
    return true;
  } catch (_) {}
  return false;
}

// Adaptation of https://github.com/vercel/next.js/blob/canary/packages/create-next-app/helpers/git.ts
const tryGitInit = async projectName => {
  // Project directory
  const cwd = path.resolve(projectName);
  let didInit = false;
  try {
    await execa("git", ["--version"], { cwd });
    if (
      (await isInGitRepository(cwd)) ||
      (await isInMercurialRepository(cwd))
    ) {
      spinner.info(content.repositoryFound);
      return false;
    }

    await execa("git", ["init"], { cwd });
    didInit = true;

    await execa("git", ["checkout", "-b", "main"], { cwd });

    await execa("git", ["add", "-A"], { cwd });
    await execa(
      "git",
      ["commit", "-m", "Initial commit from Create Mechanic"],
      { cwd }
    );
    // Notify success
    spinner.succeed(content.gitInitSucceed);
    return true;
  } catch (e) {
    if (didInit) {
      try {
        fs.rmSync(path.join(cwd, ".git"));
      } catch (_) {}
    }
    // Notify failure
    spinner.fail(content.gitInitFailed);
    return false;
  }
};

module.exports = {
  getProjectQuestion,
  confirmDFQuestion,
  confirmInstallQuestion,
  installationMethodQuestion,
  confirmGitQuestion,
  generateProjectTemplate,
  checkLockFile,
  installDependencies,
  tryGitInit
};
