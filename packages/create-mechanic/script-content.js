const {
  logo: { mechanic },
  colors: { success, bgRed, bgBlue },
} = require("@designsystemsinternational/mechanic-utils");

module.exports = {
  welcome: `${mechanic}
  
Welcome to Mechanic!`,
  questionnaireDescription: `This questionnaire will help you set up everything you need to start a new Mechanic project.
`,
  useBaseNotice: `You entered a flag to use a specific base to create a Mechanic project.
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
  projectContents: (dirPath) =>
    `It was created in the current working directory: ${dirPath}
It contains the following files:
> ${success("package.json")} (has all dependencies to use Mechanic)
> ${success("mechanic.config.js")} (for Mechanic commands configuration)
> ${success(
      "README.md"
    )} (contains some pointers on how to start using your Mechanic project)
> ${success("functions/")} (folder that will contain all design functions)

`,
  functionCreationDetails: (functionName) =>
    `This just:
> Created a folder inside functions/, called ${success(
      functionName
    )}, which has an ${success(
      "index.js"
    )} file where the design function is defined.
> Added some other dependencies into your project to make your design function work.

`,
  designFunctionDescription: `A ${
    bgRed("design ") + bgBlue("function")
  } is a JavaScript function that generates a design asset. The asset can be either static or animated, simple or complicated. A Mechanic project can have one or more design functions.
`,
  designFunctionBasesDescription: `We’ve got some working design functions for you if you need them.

${bgRed(
  "Templates"
)} are simple design functions we created to show how to use Mechanic with specific web technologies. You can use one to get to know Mechanic, or use one as a base to start your design function.

${bgBlue(
  "Examples"
)} are more complicated design functions we created to show how to use Mechanic to tackle some common use cases. Current examples include a poster generator and an instagram post generator.  
`,
  projectNameQuestion: "Name your project",
  confirmContinueQuestion:
    "Do you want to set up your first design function right now? (you can always do it afterwards)",
  confirmInstallQuestion:
    "Do you wish to install dependencies for your project right away?",
};
