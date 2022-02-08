import { getTypeValidationProperty, validationProperty, editableProperty } from "./utils.js";

export default {
  typeName: "boolean",
  properties: {
    default: getTypeValidationProperty("default", "boolean"),
    validation: validationProperty,
    editable: editableProperty,
    label: getTypeValidationProperty("label", "string")
  },
  requiredProperties: [],
  validation: (inputValue, input) => {
    if (typeof inputValue !== "boolean") {
      return `Supplied input value ${inputValue} is expected to be of type "boolean", not ${typeof inputValue}.`;
    }
  },
  prepareValue: (value, input) => {
    return value === undefined || value === null ? input.default : value;
  }
};
