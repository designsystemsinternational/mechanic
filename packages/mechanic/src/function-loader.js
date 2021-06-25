const { getOptions } = require("loader-utils");

module.exports = function () {
  const options = getOptions(this);
  console.log({ options });

  const result = `
  console.log("HEEEEEY");
  module.exports = "Hey yall!";
  `;

  console.log("----------- functions loader result ------------");
  console.log(result);
  console.log("------------------------------------------------");

  return result;
};
