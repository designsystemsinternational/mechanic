import { interactiveInputs } from "../../INPUTS";

const useInteractiveInputs = (inputs, onChange) => {
  const handlers = [];
  for (let [inputName, input] of Object.entries(inputs)) {
    if (input.type in interactiveInputs) {
      handlers.push([
        interactiveInputs[input.type].type,
        event => onChange(event, inputName, interactiveInputs[input.type].handler(event))
      ]);
    }
  }

  return handlers;
};

export { useInteractiveInputs };
