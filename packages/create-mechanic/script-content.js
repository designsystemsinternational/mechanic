const {
  logo: { mechanic, mechanicInverse },
  colors: { success, bgRed, bgBlue, fail }
} = require("@mechanic-design/utils");

const mechanicPackage = "@mechanic-design/core";
const sourceCodeUrl = "https://github.com/designsystemsinternational/mechanic";
const sourceCodeMainBranchUrl = `${sourceCodeUrl}/tree/main`;

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
  projectContents: dirPath =>
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
  generateFunctionSuccess: functionName =>
    `Design function "${functionName}" added to project!`,
  functionCreationDetails: (
    { functionName, functionDir, functionTypeDirectory },
    customInputGeneration
  ) =>
    `This just:
> Created a folder inside functions/, called ${success(
      functionName
    )}, which has an ${success(
      "index.js"
    )} file where the design function is defined.
> Added some other dependencies into your project to make your design function work.
${
  customInputGeneration.tried
    ? customInputGeneration.success
      ? "> Added a custom input used in the function. You can find it in the " +
        success("inputs/") +
        " folder \n"
      : "> " +
        fail("Tried") +
        " adding a needed custom input, but it wasn't possible. " +
        "Check " +
        `${sourceCodeMainBranchUrl}/packages/create-mechanic/${functionTypeDirectory}${
          functionDir !== "" ? "/" + functionDir : ""
        }/inputs for the input's source code.\n`
    : ""
}`,
  confirmGitInitQuestion:
    "Do you wish to initialize a git repository for your project right away?",
  repositoryFound: "Repository already found. Git repository not initialized.",
  gitInitSucceed: `Git repository initialized.`,
  gitInitFailed: `Failed to initialize git repository. Try initializing yourself to check the issue.`,
  confirmInstallQuestion:
    "Do you wish to install dependencies for your project right away?",
  installationMethodQuestion:
    "Do you wish to install dependencies using npm or yarn?",
  installingDependenciesMessage: "\nDependencies to install:",
  dependencyItem: dep =>
    !dep.includes("@mechanic-design")
      ? `- ${dep}`
      : `- ${bgRed("@mechanic-design")}/${bgBlue(dep.split("/")[1])}`,
  installTry: method => `Trying with ${method}.`,
  installSucceed: method => `Installed dependencies with ${method}.`,
  installFailed: method =>
    `Failed to install with ${method}. Try installing by yourself to check the issue.`,
  doneAndNextStepsMessage: (projectName, installation) => `
Done! Mechanic project created at ${success(projectName)}
To start you now can run:
> \`cd ${projectName}\`${
    !installation
      ? "\n> `npm install` or `yarn install`"
      : !installation.success
      ? `\n> \`${installation.installingMethod} install\``
      : ""
  }${
    !installation
      ? "\n> `npm run dev` or `yarn run dev`"
      : `\n> \`${installation.installingMethod} run dev\``
  }
`,
  bye: mechanicInverse,

  welcomeNewFunction: `${mechanic}

  `,
  notMechanicProjectError: `Not mechanic project: new function can only be run inside mechanic project.
  Either the current working directory does not contain a valid package.json or '${mechanicPackage}' is not specified as a dependency`,

  newFunctionNextStepsMessage: (functionDir, installation) => `
Done! Design function created at ${success(functionDir)}
To start you now can run:${
    !installation
      ? "\n> `npm install` or `yarn install`"
      : !installation.success
      ? `\n> \`${installation.installingMethod} install\``
      : ""
  }${
    !installation
      ? "\n> `npm run dev` or `yarn run dev`"
      : `\n> \`${installation.installingMethod} run dev\``
  }
  `
};
