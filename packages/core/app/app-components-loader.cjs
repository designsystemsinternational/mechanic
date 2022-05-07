const path = require("path");
const { getOptions } = require("loader-utils");

module.exports = function () {
  const { appCompsPath } = getOptions(this);

  const result = `
import * as components from "${appCompsPath.split(path.sep).join("/")}";
export const appComponents = components;
`;
  // console.log(result);
  return result;
};
