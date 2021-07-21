const fs = require("fs");
const path = require("path");
const { getOptions } = require("loader-utils");

// https://gist.github.com/lovasoa/8691344#gistcomment-3299018
const walkSync = (dir, callback) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walkSync(filepath, callback);
    } else if (stats.isFile()) {
      callback(file, filepath, stats);
    }
  });
};

module.exports = function () {
  const { functionsPath } = getOptions(this);

  let requireFunctions = "";

  walkSync(functionsPath, (filename, filepath) => {
    if (filename === "index.js") {
      const functionName = path.dirname(filepath).split(path.sep).pop();
      const requirePath = filepath.split(path.sep).join("/");
      if (requireFunctions !== "") {
        requireFunctions += ",\n";
      }
      requireFunctions += `"${functionName}": require("${requirePath}")`;
    }
  });

  const result = `
  module.exports = {
    ${requireFunctions}
  };
  `;

  // console.log("----------- functions loader result ------------");
  // console.log(result);
  // console.log("------------------------------------------------");

  return result;
};
