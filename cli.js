const _new = require("./commands/new");
// More commands...

require("yargs")
  .scriptName("mechanic")
  .usage("$0 <cmd> [args]")
  .command("new", "Creates new project skeleton", {}, _new)
  .help().argv;