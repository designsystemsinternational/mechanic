#!/usr/bin/env node

const newCommand = require("./commands/new");
const startCommand = require("./commands/start");

require("yargs")
  .scriptName("mechanic")
  .usage("$0 <command> [args]")
  .command(newCommand)
  .command(startCommand)
  .help()
  .alias("h", "help")
  .demandCommand(1, "").argv;
