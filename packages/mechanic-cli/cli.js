#!/usr/bin/env node

const newCommand = require("./commands/new");
const serveCommand = require("./commands/serve");

require("yargs")
  .scriptName("mechanic")
  .usage("$0 <command> [args]")
  .command(newCommand)
  .command(serveCommand)
  .help()
  .alias("h", "help")
  .demandCommand(1, "").argv;
