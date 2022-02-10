const cli = require("yargs");
const path = require("path");
const resolveCwd = require("resolve-cwd");
const {
  colors: { fail },
} = require("@mechanic-design/utils");

const { mechanic, getIsMechanicProject } = require("./utils");
const newCommand = require("./new");
const getDevCommand = require("./dev");
const getBuildCommand = require("./build");
const getServeCommand = require("./serve");

const buildLocalCommands = (cli, isMechanicProject) => {
  const directory = path.resolve(".");

  function resolveLocalCommand(command) {
    if (!isMechanicProject) {
      console.log(
        fail("Not mechanic project: ") +
          `mechanic ${command} can only be run inside mechanic project.`
      );
      console.log(`Current directory: ${directory}`);
      console.log(
        `Either the current working directory does not contain a valid package.json or ` +
          `'${mechanic}' is not specified as a dependency \n`
      );

      cli.showHelp();
      return;
    }

    try {
      const cmdPath = resolveCwd.silent(`${mechanic}/src/commands/${command}`);
      if (!cmdPath) {
        console.log(
          fail(`There was a problem loading the local ${command} command.`)
        );
        console.log(
          `${mechanic} may not be installed in your site's "node_modules" directory. Perhaps you need to run "npm install"? You might need to delete your "package-lock.json" as well. \n`
        );
        cli.showHelp();
        return;
      }

      console.log(`> Loading local command from: ${cmdPath}`, "\n");

      const cmd = require(cmdPath);
      if (typeof cmd === "function") {
        return cmd;
      }

      console.log(fail(`Handler for command "${command}" is not a function.`));
      console.log(
        `Your ${mechanic} package might be corrupted, try re-installing it and running the command again. \n`
      );
      cli.showHelp();

      return;
    } catch (err) {
      console.log(
        fail(`There was a problem loading the local ${command} command:`)
      );
      console.log(err, "\n");
      console.log(
        `${mechanic} may not be installed. Perhaps you need to run "npm install"?`,
        "\n"
      );
      cli.showHelp();
      return;
    }
  }

  const getCommandHandler = (commandName, handler) => {
    return (argv) => {
      const localCmd = resolveLocalCommand(commandName) || (() => {});
      const args = { ...argv, directory };
      return handler ? handler(args, localCmd) : localCmd(args);
    };
  };

  cli
    .command(getDevCommand(getCommandHandler))
    .command(getBuildCommand(getCommandHandler))
    .command(getServeCommand(getCommandHandler));
};

module.exports = () => {
  cli
    .scriptName("mechanic")
    .usage("Usage: $0 <command> [options]")
    .command(newCommand);

  const isMechanicProject = getIsMechanicProject();
  buildLocalCommands(cli, isMechanicProject);

  return cli
    .demandCommand()
    .help()
    .alias("h", "help")
    .version()
    .alias("v", "version").argv;
};
