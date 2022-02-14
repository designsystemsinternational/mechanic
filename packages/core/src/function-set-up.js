import { MechanicValidator } from "./validation.js";

const showError = (mainMessage, error) => {
  // const div = document.createElement("div");
  // div.style = "position: absolute; top: 0; bottom: 0; right: 0; left: 0; font-family: Helvetica;";
  // const p = document.createElement("p");
  // const text = document.createTextNode(
  //   `There was an error running ${functionName} function and/or engine. Check the console to see details!`
  // );
  // p.appendChild(text);
  // div.appendChild(p);
  // document.body.appendChild(div);

  alert(mainMessage);
};

/**
 * Sets up iframe's window function that call
 * the corresponding engine and design function.
 * @param {object} designFunction - Object exported by user that holds the design function's definition.
 */
const setUp = (inputsDefs, designFunction) => {
  document.body.style = "margin: 0;";

  const validator = new MechanicValidator(inputsDefs, designFunction);

  try {
    validator.validateFunctionExports();
    validator.validateSettings();
    validator.validateInputs();

    window.run = (functionName, values, isPreview) => {
      try {
        validator.validateValues(values);
        const preparedValues = validator.prepareValues(values);
        const engine = designFunction.settings.engine.run;
        const mechanic = engine(functionName, designFunction, preparedValues, isPreview);
        return mechanic ? mechanic : null;
      } catch (error) {
        showError(
          `There was an error running ${functionName} function and/or engine. Check the console to see details!`,
          error
        );
        throw error;
      }
    };
    console.info("Design function definition set.");
  } catch (error) {
    window.run = functionName => {
      showError(
        `There was an error loading ${functionName} function and/or engine. Check the console to see details!`,
        error
      );
    };
    throw error;
  }
};

export { setUp };
