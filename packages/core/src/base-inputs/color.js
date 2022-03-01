import {
  getTypeValidationProperty,
  validationProperty,
  editableProperty,
  getOptionsProperty,
  hasKey
} from "./utils.js";

export default {
  typeName: "color",
  properties: {
    default: getTypeValidationProperty("default", "string"),
    validation: validationProperty,
    editable: editableProperty,
    label: getTypeValidationProperty("label", "string"),
    options: getOptionsProperty("string")
  },
  requiredProperties: ["default"],
  validation: (inputValue, input) => {
    if (typeof inputValue !== "string") {
      return `Supplied input value ${inputValue} is expected to be of type "string", not ${typeof inputValue}.`;
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
