const path = require("path");
const fs = require("fs-extra");
const tmp = require("tmp");
const { logo } = require("@mechanic-design/utils");
const { mechanic, mechanicInverse } = logo;

const checkFullPath = async relativePath => {
  const fullPath = path.resolve(relativePath);
  const exists = await fs.pathExists(fullPath);
  return exists ? fullPath : null;
};

const getConfig = async argvConfigPath => {
  const configPath = path.resolve(argvConfigPath);
  const exists = await fs.pathExists(configPath);
  if (!exists) {
    return;
  }
  const config = require(configPath);
  return { config, configPath };
};

const getFunctionsPath = async (functionsPath, config) => {
  const relativePath = functionsPath || config.functionsPath || "./functions";
  return checkFullPath(relativePath);
};

const getInputsPath = async (inputsPath, config) => {
  const relativePath = inputsPath || config.inputsPath || "./inputs";
  return checkFullPath(relativePath);
};

const getAppCompsPath = async (appCompsPath, config) => {
  const relativePath = appCompsPath || config.appCompsPath || "./app";
  const fullPath = await checkFullPath(relativePath);
  const indexPath = fullPath ? await checkFullPath(`${relativePath}/index.js`) : null;
  return indexPath ? fullPath : null;
};

const getStaticPath = async (staticPath, config) => {
  const relativePath = staticPath || config.staticPath || "./static";
  return checkFullPath(relativePath);
};

const searchExports = (dir, callback, depth = 0) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory() && depth < 1) {
      searchExports(filepath, callback, depth + 1);
    } else if (stats.isFile() && file === "index.js" && depth === 1) {
      callback(file, filepath, stats);
    }
  });
};

const setUpFunctionPath = path.resolve(path.join(__dirname, "..", "function-set-up.js"));
const inputsPath = path.resolve(path.join(__dirname, "..", "..", "app", "INPUTS"));
const getFuncScriptContent = designFunctionPath => `
import { inputsDefs, inputErrors } from "${inputsPath}";
import * as designFunction from "${designFunctionPath.split(path.sep).join("/")}";
import { setUp } from "${setUpFunctionPath.split(path.sep).join("/")}";
setUp(inputsDefs, designFunction, inputErrors)
if (module.hot) {
  // Accept hot update
  module.hot.accept();
}`;

const generateFuncTempScripts = functionsPath => {
  const designFunctions = {};
  searchExports(functionsPath, (_, filepath) => {
    const name = path.dirname(filepath).split(path.sep).pop();
    designFunctions[name] = { original: filepath };
  });

  tmp.setGracefulCleanup();
  const tempDirObj = tmp.dirSync({
    dir: tmp.tmpdir,
    prefix: "tmp-func-mechanic--",
    unsafeCleanup: true
  });
  Object.entries(designFunctions).map(([name, designFuncObj]) => {
    const tempScriptName = path.join(tempDirObj.name, `${name}.js`);
    fs.writeFileSync(tempScriptName, getFuncScriptContent(designFuncObj.original));
    designFunctions[name]["temp"] = tempScriptName;
  });
  return [designFunctions, tempDirObj];
};

const setUpInputsPath = path.resolve(path.join(__dirname, "..", "input-set-up.js"));
const inputScriptContent = `
import { setUp } from "${setUpInputsPath.split(path.sep).join("/")}";
const [inputsDefs, customComponents, interactiveInputs, inputErrors] = setUp(customInputs);
export {inputsDefs, customComponents, interactiveInputs, inputErrors};
`;

const generateInputScript = inputsPath => {
  const customInputs = {};
  let importSection = "";
  let codeSection = " const customInputs = {";
  if (inputsPath) {
    let counter = 0;
    searchExports(inputsPath, (_, filepath) => {
      const name = path.dirname(filepath).split(path.sep).pop();
      importSection += `import * as export${counter} from "${filepath
        .split(path.sep)
        .join("/")}";\n`;
      if (codeSection[codeSection.length - 1] !== "{") codeSection += ",\n";
      codeSection += `"${name}": export${counter}`;
      counter += 1;
      customInputs[name] = { original: filepath, fileName: name };
    });
  }
  codeSection += "\n};";
  const result = importSection + codeSection + inputScriptContent;
  // console.log(result);

  return [customInputs, result];
};

const setCustomInterrupt = (callback, tempDirObjs = []) => {
  process.on("SIGINT", function () {
    if (tempDirObjs.length > 0) tempDirObjs.forEach(obj => obj.removeCallback());
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
  getInputsPath,
  getAppCompsPath,
  getStaticPath,
  generateInputScript,
  generateFuncTempScripts,
  setCustomInterrupt,
  greet,
  goodbye
};
