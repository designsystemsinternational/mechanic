module.exports = function () {
  const { inputs } = this.getOptions();
  const { inputsPath, inputScriptContent, customInputs } = inputs;
  return inputScriptContent;
};
