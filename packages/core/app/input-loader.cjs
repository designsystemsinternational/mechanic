const { getOptions } = require("loader-utils");

module.exports = function () {
  const { inputs } = getOptions(this);
  const { inputsPath, inputScriptContent, customInputs } = inputs;
  return inputScriptContent;
};
