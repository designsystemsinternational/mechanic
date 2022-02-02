import seedrandom from "seedrandom";

const isObject = obj => !!(obj && typeof obj === "object");
const hasKey = (obj, key) => obj.hasOwnProperty(key);
const supportedTypes = {
  text: "string",
  number: "number",
  boolean: "boolean",
  color: "string",
  image: "undefined"
};
const requiredKeys = ["type", "default"];
const requiredKeysExceptions = { image: ["default"], boolean: ["default"] };
const otherInputs = { preset: true, scaleToFit: true, randomSeed: true };

/**
 * Receives the inputs definitions and checks that it is valid
 * @param {object} inputs - Inputs definition from the design function
 */
const validateInputs = inputs => {
  // Check all inputs
  for (let inputName in inputs) {
    const input = inputs[inputName];
    const { type: inputType, default: defaultValueOfInput } = input;

    // Check for all required properties
    for (let requiredKey of requiredKeys) {
      if (
        !hasKey(input, requiredKey) &&
        !(
          hasKey(requiredKeysExceptions, inputType) &&
          requiredKeysExceptions[inputType].includes(requiredKey)
        )
      ) {
        return `Input "${inputName}" must have '${requiredKey}' property.`;
      }
    }

    // Check type is supported by Mechanic
    if (!hasKey(supportedTypes, inputType)) {
      return `Input of type ${inputType} not supported, expected either: ${Object.keys(
        supportedTypes
      )}.`;
    }

    // Check default value is of correct type to corresponding input type
    if (hasKey(input, "default") && typeof defaultValueOfInput !== supportedTypes[inputType]) {
      return `Invalid default property value for input "${inputName}" of type ${inputType}. Expected to be ${supportedTypes[inputType]}.`;
    }

    // Check that 'validation' property is function
    if (hasKey(input, "validation") && typeof input.validation !== "function") {
      return `Expected function in validation property in "${inputName}". Got ${typeof input.validation}.`;
    }

    // Check that 'editable' property is function
    if (
      hasKey(input, "editable") &&
      typeof input.editable !== "function" &&
      typeof input.editable !== "boolean"
    ) {
      return `Expected function or boolean in editable property in "${inputName}". Got ${typeof input.editable}.`;
    }

    // Check that 'label' property is string
    if (hasKey(input, "label") && typeof input.label !== "string") {
      return `Expected string in label property in ${inputName}. Got ${typeof input.label}.`;
    }

    // Check 'options' property
    if (hasKey(input, "options")) {
      const { options } = input;
      // Should be function or object
      if (!Array.isArray(options) && typeof options !== "object") {
        return `Expected array or object in options property in ${inputName}. Got ${typeof options}.`;
      }
      // If it's not an array, it's an object
      else if (!Array.isArray(options)) {
        // It should be consistent with 'default' property
        if (!Object.keys(options).includes(defaultValueOfInput)) {
          return `Default value ${defaultValueOfInput} for ${inputName} is not present in given options: ${Object.keys(
            options
          )}. `;
        }
        // All values should be consistent with the input type
        for (let option in options) {
          if (typeof options[option] !== supportedTypes[inputType]) {
            return `Incorrect type of value ${option} (${typeof options[
              option
            ]}) in options object for ${inputName}. Expected ${inputType}.`;
          }
        }
      }
      // If it's an array
      else if (Array.isArray(options)) {
        // It should be consistent with 'default' property
        if (!options.includes(defaultValueOfInput)) {
          return `Default value ${defaultValueOfInput} for ${inputName} is not present in given options: ${options} `;
        }
        // All values should be consistent with the input type
        for (let option of options) {
          if (typeof option !== supportedTypes[inputType]) {
            return `Incorrect type of value ${option} (${typeof option}) in options array for ${inputName}. Expected ${inputType}.`;
          }
        }
      }
    }
  }
  return null;
};

/**
 * Receives the inputs and values, and validates that the values
 * are valid according to the template.
 * @param {object} inputs - Inputs definition from the design function
 * @param {object} values - Values for some or all of the inputs
 */
const validateValues = (inputs, values = {}) => {
  for (let inputName in inputs) {
    const input = inputs[inputName];
    // Validate that values for options are specified in the template
    if (hasKey(values, inputName) && hasKey(input, "options")) {
      const { options } = input;
      if (Array.isArray(options) && !options.includes(values[inputName])) {
        return `Supplied input "${inputName}" is not available in the template options: ${options}`;
      } else if (!Array.isArray(options) && !hasKey(options, values[inputName])) {
        return `Supplied input "${inputName}" (${values[inputName]
          }) is not available in the template options: ${Object.keys(options)}`;
      }
    }
    // Run validation functions for values.
    if (hasKey(values, inputName) && hasKey(input, "validation")) {
      const error = input.validation(values[inputName]);
      if (error !== null && error !== undefined) {
        return `Validation error for "${inputName}" returned: ${error}`;
      }
    }
  }

  // Check that there are not other values besides inputs and default inputs
  for (let inputName in values) {
    if (!hasKey(inputs, inputName) && !hasKey(otherInputs, inputName)) {
      return `Unexpected ${inputName} value not defined on template.`;
    }
  }

  return null;
};

/**
 * Receives the settings from a function and validates it.
 * @param {object} settings - Design function settings
 */
const validateSettings = settings => {
  // Check that engine key is present
  if (!hasKey(settings, "engine")) {
    return `The design function must have specify an engine in settings`;
  }
  return null;
};

/**
 * Receives the inputs and values, and returns an object with values for
 * inputs (including defaults if value is missing) that can be passed to the
 * design function.
 * @param {object} inputs - Inputs definition from the design function
 * @param {object} settings - Settings from the design function
 * @param {object} baseValues - Values for some or all of the inputs
 */
const prepareValues = (inputs, settings, baseValues) => {
  const values = Object.assign({}, baseValues);
  const persistRandomOnExport =
    !hasKey(settings, "persistRandomOnExport") || settings.persistRandomOnExport;

  // Sets random seed
  if (persistRandomOnExport) {
    if (values.randomSeed === undefined) {
      values.randomSeed = seedrandom(null, { global: true });
    }
    seedrandom(values.randomSeed, { global: true });
  }

  // Go through inputs and set values based on baseValues and defaults
  Object.entries(inputs).forEach(([name, input]) => {
    if (hasKey(input, "options")) {
      let value = baseValues[name] || input.default;
      if (Array.isArray(input.options)) {
        const index = input.options.indexOf(value);
        value = input.options[index];
      } else {
        value = input.options[value];
      }
      values[name] = value;
    } else {
      values[name] = baseValues[name] === undefined ? input.default : baseValues[name];
    }
  });

  // Scale down to fit if width and height are inputs
  if (baseValues.scaleToFit && values.width && values.height) {
    const ratioWidth = baseValues.scaleToFit.width ? baseValues.scaleToFit.width / values.width : 1;
    const ratioHeight = baseValues.scaleToFit.height
      ? baseValues.scaleToFit.height / values.height
      : 1;
    if (ratioWidth < 1 || ratioHeight < 1) {
      const ratio = ratioWidth < ratioHeight ? ratioWidth : ratioHeight;
      values.width = Math.floor(values.width * ratio);
      values.height = Math.floor(values.height * ratio);
    }
  }
  return values;
};

/**
 * Checks whether a DOM element is instance of SVGElement
 * @param {object} el - A DOM element to check
 */
const isSVG = el => el instanceof SVGElement;

/**
 * Checks whether a DOM element is instance of HTMLCanvasElement
 * @param {object} el - A DOM element to check
 */
const isCanvas = el => el instanceof HTMLCanvasElement;

/**
 * Validates that a DOM element is SVG or Canvas
 * @param {object} el - A DOM element to check
 */
const validateEl = el => {
  if (isSVG(el) || isCanvas(el) || el instanceof HTMLElement) {
    return null;
  }
  return "Element passed to the frame() function must be SVGElement, HTMLCanvasElement or HTMLElement";
};

/**
 * Validates that running browser supports webp generations.
 * Extracted from: https://stackoverflow.com/questions/5573096/detecting-webp-support
 */
function supportsFormatWebP() {
  const elem = document.createElement("canvas");

  if (!!(elem.getContext && elem.getContext("2d"))) {
    // was able or not to get WebP representation
    return elem.toDataURL("image/webp").indexOf("data:image/webp") == 0;
  } else {
    // very old browser like IE 8, canvas not supported
    return false;
  }
}

export {
  isObject,
  hasKey,
  supportedTypes,
  validateInputs,
  validateValues,
  validateSettings,
  prepareValues,
  isSVG,
  isCanvas,
  validateEl,
  supportsFormatWebP
};
