const path = require("path");
const fs = require("fs-extra");
const tmp = require("tmp");
const {
  logo: { mechanic, mechanicInverse }
} = require("@mechanic-design/utils");

const getConfig = async argvConfigPath => {
  const configPath = path.resolve(argvConfigPath);
  const exists = await fs.pathExists(configPath);
  if (!exists) {
    return;
  }
  return { config: require(configPath), configPath };
};

const getFunctionsPath = async (functionsPath, config) => {
  const relativePath = functionsPath || config.functionsPath || "./functions";
  const fullPath = path.resolve(relativePath);
  const exists = await fs.pathExists(fullPath);
  return exists ? fullPath : null;
};

const searchDesignFunctions = (dir, callback, depth = 0) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory() && depth < 1) {
      searchDesignFunctions(filepath, callback, depth + 1);
    } else if (stats.isFile() && file === "index.js" && depth === 1) {
      callback(file, filepath, stats);
    }
  });
};

const setUpFunctionDir = path.resolve(path.join(__dirname, "..", "function-set-up.js"));
const getScripContent = designFunctionPath => `
const designFunction = require("${designFunctionPath}");
const { setUp } = require("${setUpFunctionDir}");
setUp(designFunction)
if (module.hot) {
  // Accept hot update
  module.hot.accept();
}`;

const generateTempScripts = functionsPath => {
  const designFunctions = {};
  searchDesignFunctions(functionsPath, (_, filepath) => {
    const name = path.dirname(filepath).split(path.sep).pop();
    designFunctions[name] = { original: filepath };
  });

  tmp.setGracefulCleanup();
  const tempDirObj = tmp.dirSync({
    dir: tmp.tmpdir,
    prefix: "tmp-mechanic--",
    unsafeCleanup: true
  });
  Object.entries(designFunctions).map(([name, designFuncObj]) => {
    const tempScriptName = path.join(tempDirObj.name, `${name}.js`);
    fs.writeFileSync(tempScriptName, getScripContent(designFuncObj.original));
    designFunctions[name]["temp"] = tempScriptName;
  });
  return [designFunctions, tempDirObj];
};

const setCustomInterrupt = (callback, tempDirObj) => {
  process.on("SIGINT", function () {
    if (tempDirObj) tempDirObj.removeCallback();
    callback();
    process.exit();
  });
};

const greet = () => {
  console.log(`${mechanic}
`);
};

const goodbye = () => {
  console.log(`
Bye!

${mechanicInverse}`);
};

module.exports = {
  getConfig,
  getFunctionsPath,
  generateTempScripts,
  setCustomInterrupt,
  greet,
  goodbye
};
