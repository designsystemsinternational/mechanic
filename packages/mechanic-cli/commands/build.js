module.exports = (getCommandHandler) => ({
  command: "build [configPath] [functionsPath] [distDir]",
  aliases: ["b"],
  desc: "Builds local project",
  builder: (yargs) =>
    yargs
      .default("configPath", "./mechanic.config.js")
      .default("functionsPath", "./functions")
      .default("distDir", "./dist"),
  handler: getCommandHandler("build"),
});
