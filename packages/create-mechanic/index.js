const fs = require("fs-extra");
const path = require("path");
const execa = require("execa");
const inquirer = require("inquirer");
const {
  spinners: { mechanicSpinner: spinner },
  logo: { mechanic: logo },
  colors: { success },
} = require("@designsystemsinternational/mechanic-utils");

const {
  generateFunctionTemplate,
  getFunctionQuestions,
} = require("./new-function");

const projectTemplateDir = path.join(__dirname, "project-template");
const generateProjectTemplate = async (projectName) => {
  spinner.start("Generating mechanic project directory...");

  // Make new directories
  const directory = path.resolve(projectName);
  await fs.mkdir(directory); // Main
  await fs.mkdir(path.join(directory, "functions")); // Functions folder

  // Copying content promises
  await Promise.all([
    // Copy array of files that get duplicated without change
    ...["mechanic.config.js", "_gitignore", "README.md"].map((filename) =>
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

  // End UI spinner
  spinner.succeed("Mechanic project directory created!");
};

const installDependencies = async (projectName) => {
  spinner.start("Installing dependencies. This may take a few minutes.");

  // Project directory
  const cwd = path.resolve(projectName);

  try {
    // Install with yarn
    await execa("yarn", ["install"], { cwd });
    // End success UI spinner
    spinner.succeed("Installed dependencies with yarn.");
    return "yarn";
  } catch (err) {
    if (err.failed) {
      // Notify failure
      spinner.warn("Failed to install with yarn.");
      spinner.start("Trying with npm.");
      try {
        // Install with npm
        await execa("npm", ["install"], { cwd });
        // End success UI spinner
        spinner.succeed("Installed dependencies with npm.");
      } catch (npmErr) {
        // Notify failure
        spinner.fail("Failed to install with npm.");
        throw npmErr;
      }
      return "npm";
    }
    throw err;
  }
};

const getQuestions = (initialAnswers) => ({
  project: [
    {
      name: "project",
      type: "input",
      message: "Name your project",
      default: initialAnswers.project || "my-project",
      validate: async (project) => {
        const exists = await fs.pathExists(path.resolve(project));
        return !exists
          ? true
          : "Directory already exists. Enter name that doesn't exists.";
      },
    },
  ],
  function: getFunctionQuestions(initialAnswers),
});

const command = async (argv) => {
  const project = argv._[0];
  const template = argv.template || argv.t;
  const example = argv.example || argv.e;
  const questions = getQuestions({ project, template, example });

  // Welcome to mechanic!
  console.log(logo, "\n");
  if (project || template || example) {
    console.log("Received arguments loaded as defaults");
  }

  // Confirm and generate project
  const { project: projectName } = await inquirer.prompt(questions.project);
  await generateProjectTemplate(projectName);

  // Confirm and generate new project directory and content files
  const functionAnswers = await inquirer.prompt(questions.function);
  await generateFunctionTemplate(projectName, functionAnswers);

  // Install dependencies in new project directory
  await installDependencies(projectName);

  // Done!
  console.log(`Done! Mechanic project created at ${success(projectName)}
To start you now can run:
> \`cd ${projectName}\`
> \`npm run dev\`
`);
  console.log(logo);
};

module.exports = {
  create: command,
  installDependencies,
};
