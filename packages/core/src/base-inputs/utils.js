export const hasKey = (obj, key) => obj.hasOwnProperty(key);

export const getTypeValidationProperty = (property, type) => ({
  validation: value =>
    typeof value !== type
      ? `Property "${property}" should be of type "${type}", not ${typeof value}`
      : null
});

export const validationProperty = {
  validation: value =>
    typeof value !== "function"
      ? `Property "validation" should be of type "function", not ${typeof value}`
      : null
};

export const editableProperty = {
  validation: value =>
    typeof value !== "function" && typeof value !== "boolean"
      ? `Property "editable" should be of type "function" or "boolean", not ${typeof value}`
      : null
};

export const getOptionsProperty = type => ({
  validation: (value, input) => {
    // It should be an array or object
    if (!Array.isArray(value) && typeof value !== "object") {
      return `Property "options" should array or object, not ${typeof value}.`;
    }
    // If it's not an array, it's an object
    else if (!Array.isArray(value)) {
      // It should be consistent with 'default' property
      if (!Object.keys(value).includes(input.default)) {
        return `Default value ${input.default} is not present in given options: ${Object.keys(
          value
        )}. `;
      }
      // All values should be consistent with the input type
      for (let option in value) {
        if (typeof value[option] !== type) {
          return `Incorrect type of value ${option} (${typeof value[
            option
          ]}) \. Expected "${type}".`;
        }
      }
    }
    // If it's an array
    else if (Array.isArray(value)) {
      // It should be consistent with 'default' property
      if (!value.includes(input.default)) {
        return `Default value ${input.default} is not present in given options: ${value} `;
      }
      // All values should be consistent with the input type
      for (let option of value) {
        if (typeof option !== type) {
          return `Incorrect type of value ${option} (${typeof option}) in options array. Expected "${type}".`;
        }
      }
    }
    return null;
  }
});
