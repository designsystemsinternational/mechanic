#!/usr/bin/env node
const {
  colors: { success },
} = require("@mechanic-design/utils");

console.warn(
  "\n@mechanic-design/create is deprecated" +
    ` use ${success("npm init mechanic")} instead\n`
);
