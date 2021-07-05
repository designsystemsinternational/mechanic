const path = require("path");
const inquirer = require("inquirer");
const {
  colors: { fail, success },
  logo: { mechanic: logo },
} = require("@designsystemsinternational/mechanic-utils");
const {
  create,
  installDependencies,
} = require("@designsystemsinternational/create-mechanic");
const {
  generateFunctionTemplate,
  getFunctionQuestions,
} = require("@designsystemsinternational/create-mechanic/new-function");

const { mechanic, getIsMechanicProject } = require("./utils");

const newFunctionCommand = async (argv) => {
  const isMechanicProject = getIsMechanicProject();
  if (!isMechanicProject) {
    console.log(
      fail("Not mechanic project: ") +
        `new function can only be run inside mechanic project.`
    );
    console.log(
      `Either the current working directory does not contain a valid package.json or ` +
        `'${mechanic}' is not specified as a dependency \n`
    );
    return;
  }

  const config = require(path.resolve("mechanic.config.js"));

  const functionName = argv._[2];
  const template = argv.template || argv.t;
  const example = argv.example || argv.e;
  const questions = getFunctionQuestions(
    { functionName, template, example },
    config
  );

  console.log(logo, "\n");
  if (functionName || template || example) {
    console.log("Received arguments loaded as defaults");
  }

  // Confirm and generate new project directory and content files
  const functionAnswers = await inquirer.prompt(questions);
  const functionDir = await generateFunctionTemplate(
    ".",
    functionAnswers,
    config
  );
  await installDependencies(".");
  // Done!
  console.log(`Done! Design function created at ${success(functionDir)}
To start you now can run:
> \`npm run dev\`
`);
  console.log(logo);
};

module.exports = {
  command: "new",
  aliases: ["n"],
  desc: "Creates new mechanic project ",
  builder: (yargs) =>
    yargs
      .option("template", { aliases: ["t"] })
      .option("example", { aliases: ["e"] })
      .command({
        command: "function",
        aliases: ["f"],
        desc: "Creates new mechanic design function in existing mechanic project",
        builder: (yargs) =>
          yargs
            .option("template", { aliases: ["t"] })
            .option("example", { aliases: ["e"] }),
        handler: newFunctionCommand,
      }),
  handler: (argv) => {
    argv._ = argv._.slice(1);
    create(argv);
  },
};
