import {
  getTypeValidationProperty,
  validationProperty,
  editableProperty,
  getOptionsProperty,
  hasKey
} from "./utils.js";

export default {
  typeName: "number",
  properties: {
    default: getTypeValidationProperty("default", "number"),
    validation: validationProperty,
    editable: editableProperty,
    label: getTypeValidationProperty("label", "string"),
    options: getOptionsProperty("number"),
    min: getTypeValidationProperty("min", "number"),
    max: getTypeValidationProperty("max", "number"),
    step: getTypeValidationProperty("step", "number"),
    range: getTypeValidationProperty("range", "boolean")
  },
  requiredProperties: ["default"],
  validation: (inputValue, input) => {
    if (typeof inputValue !== "number") {
      return `Supplied input value ${inputValue} is expected to be of type "number", not ${typeof inputValue}.`;
    }
    if (hasKey(input, "options")) {
      const { options } = input;
      if (Array.isArray(options) && !options.includes(inputValue)) {
        return `Supplied input value ${inputValue} is not available in the options: ${options}`;
      } else if (!Array.isArray(options) && !hasKey(options, inputValue)) {
        return `Supplied input value ${inputValue} is not available in the options: ${Object.keys(
          options
        )}`;
      }
    } else if (hasKey(input, "min") && inputValue < input.min) {
      return `Supplied input value ${inputValue} is lower than minimum value: ${input.min}`;
    } else if (hasKey(input, "max") && inputValue > input.max) {
      return `Supplied input value ${inputValue} is greater than maximum value: ${input.min}`;
    }
  },
  initValue: input => input.default,
  prepareValue: (value, input) => {
    const v = value === undefined || value === null ? input.default : value;
    if (hasKey(input, "options")) {
      if (Array.isArray(input.options)) {
        const index = input.options.indexOf(v);
        return input.options[index];
      } else {
        return input.options[v];
      }
    }
    return v;
  }
};
