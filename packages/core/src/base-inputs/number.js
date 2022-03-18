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
    if (typeof inputValue !== "number" && typeof inputValue !== "string") {
      return `Supplied input value ${inputValue} is expected to be of type "number", not ${typeof inputValue}.`;
    } else if (typeof inputValue === "string" && Number.isNaN(parseFloat(inputValue))) {
      return `Supplied input value ${inputValue} is unparsable string.`;
    }
    const value = typeof inputValue === "string" ? parseFloat(inputValue) : inputValue;
    if (hasKey(input, "options")) {
      const { options } = input;
      if (Array.isArray(options) && !options.includes(value)) {
        return `Supplied input value ${value} is not available in the options: ${options}`;
      } else if (!Array.isArray(options) && !hasKey(options, value)) {
        return `Supplied input value ${value} is not available in the options: ${Object.keys(
          options
        )}`;
      }
    } else if (hasKey(input, "min") && value < input.min) {
      return `Supplied input value ${value} is lower than minimum value: ${input.min}`;
    } else if (hasKey(input, "max") && value > input.max) {
      return `Supplied input value ${value} is greater than maximum value: ${input.min}`;
    }
  },
  initValue: input => input.default,
  prepareValue: (value, input) => {
    const v =
      value === undefined || value === null
        ? input.default
        : typeof value === "string"
        ? parseFloat(value)
        : value;
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
