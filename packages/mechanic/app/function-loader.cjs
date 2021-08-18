const { getOptions } = require("loader-utils");

module.exports = function () {
  const { designFunctions } = getOptions(this);

  let requireFunctions = "";
  Object.entries(designFunctions).map(([name, designFunctionObj]) => {
    if (requireFunctions !== "") {
      requireFunctions += ",\n";
    }
    requireFunctions += `"${name}": require("${designFunctionObj.original}")`;
  });

  const result = `
module.exports = {
  ${requireFunctions}
};
`;
  return result;
};
