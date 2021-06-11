const fs = require("fs-extra");
const path = require("path");
const execa = require("execa");

const inquirer = require("inquirer");
const ora = require("ora");
const { mechanicSpinner } = require("./utils/spinners");

const templateDir = path.normalize(`${__dirname}/../template`);

const generateProjectTemplate = async ({ project, functionName, template }) => {
  // Start UI spinner
  const spinner = ora({
    text: "Generating mechanic project template",
    spinner: mechanicSpinner,
  }).start();

  // Make new directories
  const directory = path.resolve(project);
  await fs.mkdir(directory); // Main
  await fs.mkdir(path.join(directory, "functions")); // Functions folder
  const functionDir = path.join(directory, "functions", functionName);
  await fs.mkdir(functionDir); // Design function folder

  // Path of template file to copy
  const functionTemplatePath = path.join(
    templateDir,
    "functions",
    template.dir,
    "index.js"
  );

  // Copying content promises
  await Promise.all([
    // Copy array of files that get duplicated without change
    ...[path.join("functions", "index.js"), "mechanic.config.js"].map(
      (filename) =>
        fs.copyFile(
          path.join(templateDir, filename),
          path.join(directory, filename.replace(/^_/, "."))
        )
    ),
    // Load package.json as object and add metadata
    (async () => {
      let packageJson = await fs.readFile(
        path.join(templateDir, "package.json"),
        "utf8"
      );
      const packageObj = {
        name: project, // Adds name of project
        ...JSON.parse(packageJson),
      };
      // Add to dependencies the selected engine
      // packageObj["dependencies"][
      //   `@designsystemsinternational/mechanic-engine-${template.engine}`
      // ] = "^1.0.0";
      // Write the resulting package
      await fs.writeFile(
        path.join(directory, "package.json"),
        JSON.stringify(packageObj, null, 2)
      );
    })(),
    // Copy template design function with different names
    fs.copyFile(functionTemplatePath, path.join(functionDir, "index.js")),
  ]);

  // End UI spinner
  spinner.succeed();
};

const installDependencies = async ({ project }) => {
  // Start UI spinner
  const spinner = ora({
    text: "Installing dependencies. This may take a few minutes.",
    spinner: mechanicSpinner,
  }).start();

  // Project directory
  const cwd = path.resolve(project);

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

const templateOptions = [
  {
    name: "Vanilla JS Image",
    engine: "svg",
    type: "SVG",
    dir: "svgImage",
  },
  {
    name: "Vanilla JS Animation",
    engine: "svg",
    type: "SVG",
    dir: "svgVideo",
  },
  {
    name: "Vanilla JS Image",
    engine: "canvas",
    type: "Canvas",
    dir: "canvasImage",
  },
  {
    name: "Vanilla JS Animation",
    engine: "canvas",
    type: "Canvas",
    dir: "canvasVideo",
  },
  {
    name: "React Image",
    engine: "react",
    type: "SVG",
    dir: "reactImage",
  },
  {
    name: "React Animation",
    engine: "react",
    type: "SVG",
    dir: "reactVideo",
  },
  {
    name: "p5.js Animation",
    engine: "p5",
    type: "Canvas",
    dir: "p5Animation",
  },
];

const questions = [
  {
    name: "project",
    type: "input",
    message: "Name your project",
    default: "my-project",
    validate: async (project) => {
      const exists = await fs.pathExists(path.resolve(project));
      return !exists
        ? true
        : "Directory already exists. Enter name that doesn't exists.";
    },
  },
  {
    name: "functionName",
    type: "input",
    message:
      "Name your first design function (you can always create more with `mechanic new function`)",
    default: "my-function",
  },
  {
    name: "template",
    type: "list",
    message: `Select template for your first design function`,
    choices: templateOptions.map((option) => ({
      name: `${option.name} (${option.type})`,
      value: option,
    })),
  },
];

const command = async (argv) => {
  // TODO: mechanic new function
  // if (argv._.length > 1 && argv._[1] == "function") {
  //   console.log("FUNCTION");
  // }
  // Ask user for customization input
  const answers = await inquirer.prompt(questions);
  // Generate new project directory and content files
  await generateProjectTemplate(answers);
  // Install dependencies in new project directory
  // await installDependencies(answers);
  // Done!
  console.log(`Done! 🎉 Mechanic project created at ${answers.project}
  To start you now can run:
  - \`cd ${answers.project}\`
  - \`npm run serve\`
  `);
};

module.exports = {
  command: "new",
  aliases: ["n"],
  desc: "Creates new mechanic project skeleton",
  builder: () => {},
  handler: command,
};
