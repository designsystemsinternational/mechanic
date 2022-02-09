import { useMemo } from "react";
import { interactiveInputs } from "../../INPUTS";

const useInteractiveInputs = (inputs, onChange) => {
  const handlers = useMemo(() => {
    const handlers = [];
    console.log({ inputs, interactiveInputs });
    for (let [inputName, input] of Object.entries(inputs)) {
      if (input.type in interactiveInputs) {
        handlers.push([
          interactiveInputs[input.type].type,
          event => onChange(event, inputName, interactiveInputs[input.type].handler(event))
        ]);
      }
    }
    return handlers;
  }, [inputs, onChange]);

  return handlers;
};

export { useInteractiveInputs };
