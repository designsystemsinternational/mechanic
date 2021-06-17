const path = require("path");
const resolveCwd = require("resolve-cwd");
const newCommand = require("./new");
const getDevCommand = require("./dev");

const mechanic = "@designsystemsinternational/mechanic";

const getIsMechanicProject = () => {
  let isMechanicProject = false;

  try {
    const { dependencies, devDependencies } = require(path.resolve(
      "./package.json"
    ));
    isMechanicProject =
      (dependencies && dependencies[mechanic]) ||
      (devDependencies && devDependencies[mechanic]);
  } catch (err) {
    /* ignore */
  }
  return !!isMechanicProject;
};

const buildLocalCommands = (cli, isMechanicProject) => {
  const directory = path.resolve(".");

  function resolveLocalCommand(command) {
    if (!isMechanicProject) {
      cli.showHelp();
      console.log(`current directory: ${directory}`);
      console.log(
        `mechanic <${command}> can only be run inside mechanic project.\n` +
          `Either the current working directory does not contain a valid package.json or ` +
          `'${mechanic}' is not specified as a dependency`
      );
    }

    try {
      const cmdPath = resolveCwd.silent(`${mechanic}/src/commands/${command}`);
      if (!cmdPath)
        return console.log(
          `There was a problem loading the local ${command} command. ${mechanic} may not be installed in your site's "node_modules" directory. Perhaps you need to run "npm install"? You might need to delete your "package-lock.json" as well.`
        );

      console.log(`loading local command from: ${cmdPath}`);

      const cmd = require(cmdPath);
      if (typeof cmd === "function") {
        return cmd;
      }

      console.log(
        `Handler for command "${command}" is not a function. Your ${mechanic} package might be corrupted, try reinstalling it and running the command again.`
      );
      return () => {};
    } catch (err) {
      cli.showHelp();
      return console.log(
        `There was a problem loading the local ${command} command. ${mechanic} may not be installed. Perhaps you need to run "npm install"?`,
        err
      );
    }
  }

  const getCommandHandler = (commandName, handler) => {
    return (argv) => {
      const localCmd = resolveLocalCommand(commandName);
      const args = { ...argv, directory };
      return handler ? handler(args, localCmd) : localCmd(args);
    };
  };

  cli.command(getDevCommand(getCommandHandler));
};

module.exports = () => {
  const cli = require("yargs");

  const isMechanicProject = getIsMechanicProject();

  cli
    .scriptName("mechanic")
    .usage("Usage: $0 <command> [options]")
    .help()
    .alias("h", "help")
    .version()
    .alias("v", "version")
    .command(newCommand);

  buildLocalCommands(cli, isMechanicProject);

  return cli.demandCommand(1, "").argv;
};
