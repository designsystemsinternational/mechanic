import { MechanicInputError } from "./mechanic-error.js";
import { MechanicValidator } from "./validation.js";

const modalStyle = `position: absolute;
inset: 20px;
z-index: 10000;
box-shadow: 0 0 20px 1px rgba(200, 200, 200, 0.3);
border-radius: 10px;
padding: 20px;
overflow-y: auto;
font-family: Helvetica;`;

const showError = (mainMessage, error) => {
  const previousModal = document.getElementById("error-modal");
  if (previousModal) previousModal.innerHTML = "";

  const div = document.createElement("div");
  div.id = "error-modal";
  div.style = modalStyle;

  const h1 = document.createElement("h1");
  h1.style = "font-size: 16px; color: red;";
  const header = document.createTextNode(mainMessage);
  h1.appendChild(header);
  div.appendChild(h1);

  const p = document.createElement("p");
  const code = document.createElement("code");
  code.style = "font-size: 15px; color: red;";
  code.appendChild(document.createTextNode(error));
  p.appendChild(code);
  p.appendChild(document.createTextNode(" - You may find more context in console."));
  div.appendChild(p);

  const stackDiv = document.createElement("div");
  stackDiv.style = "color: white; background: black; border-radius: 10px;padding: 10px;";

  for (let m of [...error.stack.split("\n")]) {
    const p = document.createElement("p");
    p.style = "margin: 0 0 2px 0; font-size: 12px;";
    const code = document.createElement("code");
    const text = document.createTextNode(m);
    code.appendChild(text);
    p.appendChild(code);
    stackDiv.appendChild(p);
  }

  div.appendChild(stackDiv);
  document.body.appendChild(div);

  // alert(mainMessage);
};

/**
 * Sets up iframe's window function that call
 * the corresponding engine and design function.
 * @param {object} designFunction - Object exported by user that holds the design function's definition.
 */
const setUp = (inputsDefs, designFunction, inputErrors) => {
  document.body.style = "margin: 0;";

  const validator = new MechanicValidator(inputsDefs, designFunction);

  try {
    if (inputErrors.length > 0) throw inputErrors[0];

    validator.validateFunctionExports();
    validator.validateSettings();
    validator.validateInputs();

    window.run = (functionName, values, config) => {
      try {
        validator.validateValues(values);
        const preparedValues = validator.prepareValues(values);
        const engine = designFunction.settings.engine.run;
        const mechanic = engine(functionName, designFunction, preparedValues, config);
        return mechanic ? mechanic : null;
      } catch (error) {
        showError(`There was an error running ${functionName} function and/or engine.`, error);
        setTimeout(() => {
          throw error;
        }, 0);
        return null;
      }
    };
    console.info("Design function definition set.");
  } catch (error) {
    window.run = functionName => {
      if (error instanceof MechanicInputError) {
        showError(`There was an error loading custom inputs.`, error);
      } else showError(`There was an error loading ${functionName} function and/or engine.`, error);
      return null;
    };
    throw error;
  }
};

export { setUp };
