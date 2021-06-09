const fs = require("fs-extra");
const path = require("path");
å;
const inquirer = require("inquirer");
const ora = require("ora");
const { mechanicSpinner } = require("./utils/spinners");

const templateDir = path.normalize(`${__dirname}/../template`);

const generateProjectTemplate = async ({ project, functionName, template }) => {
  const spinner = ora({
    text: "Generating mechanic project template",
    spinner: mechanicSpinner,
  }).start();

  const directory = path.resolve(project);
  const functionTemplatePath = path.normalize(
    `${__dirname}/${template.dir}/index.js`
  );
  const functionDir = path.join(directory, "functions", functionName);
  await fs.mkdir(directory);
  await fs.mkdir(path.join(directory, "functions"));
  await fs.mkdir(functionDir);
  await Promise.all([
    ...["mechanic.config.js"].map((filename) =>
      fs.copyFile(
        path.join(templateDir, filename),
        path.join(directory, filename.replace(/^_/, "."))
      )
    ),
    (async () => {
      let packageJson = await fs.readFile(
        path.join(templateDir, "package.json"),
        "utf8"
      );
      const packageObj = {
        name: project,
        ...JSON.parse(packageJson),
      };
      packageObj["dependencies"][`mechanic-engine-${template.engine}`] =
        "^1.0.0";
      await fs.writeFile(
        path.join(directory, "package.json"),
        JSON.stringify(packageObj, null, 2)
      );
    })(),
    fs.copyFile(functionTemplatePath, path.join(functionDir, "index.js")),
  ]);

  spinner.succeed();
};

// Not sure what params will receive.
// TODO: Complete.
const installDependencies = async (answers) => {
  const spinner = ora({
    text: "Installing dependencies",
    spinner: mechanicSpinner,
  }).start();

  // Simulated time passing.
  await new Promise((resolve) =>
    setTimeout(resolve, 5000 * (Math.random() + 1))
  );

  spinner.succeed();
};

const templateOptions = [
  {
    name: "Vanilla JS Image",
    engine: "svg",
    type: "SVG",
    dir: "../template/functions/svgImage",
  },
  {
    name: "Vanilla JS Animation",
    engine: "svg",
    type: "SVG",
    dir: "../template/functions/svgVideo",
  },
  {
    name: "Vanilla JS Image",
    engine: "canvas",
    type: "Canvas",
    dir: "../template/functions/canvasImage",
  },
  {
    name: "Vanilla JS Animation",
    engine: "canvas",
    type: "Canvas",
    dir: "../template/functions/canvasVideo",
  },
  {
    name: "React Image",
    engine: "react",
    type: "SVG",
    dir: "../template/functions/reactImage",
  },
  {
    name: "React Animation",
    engine: "react",
    type: "SVG",
    dir: "../template/functions/reactVideo",
  },
  {
    name: "p5.js Animation",
    engine: "p5",
    type: "Canvas",
    dir: "../template/functions/p5Animation",
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
  const answers = await inquirer.prompt(questions);
  await generateProjectTemplate(answers);
  await installDependencies(answers);
  console.log(`Done! Now run \`cd ${answers.project}\` and \`npm run dev\``);
};

module.exports = {
  command: "new",
  aliases: ["n"],
  desc: "Creates new mechanic project skeleton",
  builder: () => {},
  handler: command,
};
