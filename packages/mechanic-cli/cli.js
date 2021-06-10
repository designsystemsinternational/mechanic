#!/usr/bin/env node

const newCommand = require("./commands/new");
const devCommand = require("./commands/dev");

require("yargs")
  .scriptName("mechanic")
  .usage("$0 <command> [args]")
  .command(newCommand)
  .command(devCommand)
  .help()
  .alias("h", "help")
  .demandCommand(1, "").argv;
