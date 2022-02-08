import { getTypeValidationProperty, validationProperty, editableProperty } from "./utils.js";

export default {
  typeName: "image",
  properties: {
    validation: validationProperty,
    editable: editableProperty,
    label: getTypeValidationProperty("label", "string")
  },
  requiredProperties: [],
  validation: () => null,
  prepareValue: v => v
};
