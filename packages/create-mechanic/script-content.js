const {
  logo: { mechanic, mechanicInverse },
  colors: { success, bgRed, bgBlue },
} = require("@mechanic-design/utils");

const mechanicPackage = "@mechanic-design/core";

module.exports = {
  welcome: `${mechanic}
  
Welcome to Mechanic!`,
  questionnaireDescription: `This questionnaire will help you set up everything you need to start a new Mechanic project.
`,
  useBaseNotice: `You entered a flag to use a specific base to create a Mechanic project.
`,

  projectNameQuestion: "Name your project",
  projectNameExistsError:
    "Directory already exists. Enter name that doesn't exists.",
  generateProjectStart: "Generating mechanic project directory...",
  generateProjectSuccess: (typeOfBaseUsed, projectName) =>
    `Mechanic ${typeOfBaseUsed ? typeOfBaseUsed : "project"} ${success(
      projectName
    )} directory created!`,
  projectContents: (dirPath) =>
    `It was created in the current working directory: ${dirPath}
It contains the following files:
> ${success("package.json")} (has all dependencies to use Mechanic)
> ${success(
      "mechanic.config.js"
    )} (sets configuration for Mechanic commands to use)
> ${success(
      "README.md"
    )} (contains some pointers on how to start using your Mechanic project)
> ${success("functions/")} (folder that will contain all design functions)

`,

  baseDoesNotExist: (typeOfBaseUsed, base) =>
    `Failed to find ${typeOfBaseUsed} of name "${base}". Check the docs for the available options.
`,
  baseExist: (typeOfBaseUsed, base) =>
    `${
      typeOfBaseUsed === "template" ? "Template" : "Example"
    } "${base}" available!
`,
  directoryAlreadyExist: (typeOfBaseUsed, base) =>
    `Directory of name "${base}" already exists. Change name of existing folder or try in another directory.
`,

  designFunctionDescription: `A ${
    bgRed("design ") + bgBlue("function")
  } is a JavaScript function that generates a design asset. The asset can be either static or animated, simple or complicated. A Mechanic project can have one or more design functions.
`,
  confirmContinueQuestion: `Do you want to set up your first design function right now? (you can always do it afterwards)`,
  designFunctionBasesDescription: `We’ve got some working design functions for you if you need them.

${bgRed(
  "Templates"
)} are simple design functions we created to show how to use Mechanic with specific web technologies. You can use one to get to know Mechanic, or use one as a base to start your design function.

${bgBlue(
  "Examples"
)} are more complicated design functions we created to show how to use Mechanic to tackle some common use cases. The only current example is a poster generator. More examples will be added along the way. 
`,

  functionBaseQuestion: (isFirst = true) =>
    `Do you want to use a template or an example as a base for your${
      isFirst ? " first" : ""
    } design function?`,
  functionTemplateQuestion: (isFirst = true) =>
    `Select template for your${isFirst ? " first" : ""} design function`,
  functionExampleQuestion: (isFirst = true) =>
    `Select example to use as base for your${
      isFirst ? " first" : ""
    } design function`,
  functionNameQuestion: (isFirst = true) =>
    `Name your${isFirst ? " first" : ""} design function`,
  functionNameExistsError:
    "Directory already exists. Enter name that doesn't exists.",
  generateFunctionStart: "Adding design function to project...",
  generateFunctionSuccess: (functionName) =>
    `Design function "${functionName}" added to project!`,
  functionCreationDetails: (functionName) =>
    `This just:
> Created a folder inside functions/, called ${success(
      functionName
    )}, which has an ${success(
      "index.js"
    )} file where the design function is defined.
> Added some other dependencies into your project to make your design function work.

`,

  confirmInstallQuestion:
    "Do you wish to install dependencies for your project right away?",
  installTry: (method) => `Trying with ${method}.`,
  installSucceed: (method) => `Installed dependencies with ${method}.`,
  installFailed: (method) => `Failed to install with ${method}.`,
  installFail:
    "Failed to install with npm. Try installing by yourself to check the issue.",

  doneAndNextStepsMessage: (
    projectName,
    installed
  ) => `\nDone! Mechanic project created at ${success(projectName)}
To start you now can run:
> \`cd ${projectName}\`${installed ? "" : "\n> `npm i`"}
> \`npm run dev\`
`,
  bye: mechanicInverse,

  welcomeNewFunction: `${mechanic}

  `,
  notMechanicProjectError: `Not mechanic project: new function can only be run inside mechanic project.
  Either the current working directory does not contain a valid package.json or '${mechanicPackage}' is not specified as a dependency`,

  newFunctionNextStepsMessage: (
    functionDir,
    installed
  ) => `Done! Design function created at ${success(functionDir)}
To start you now can run:${installed ? "" : "\n> `npm i`"}
> \`npm run dev\`
  `,
};
