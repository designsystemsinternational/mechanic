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
const requiredKeysExceptions = { image: ["default"] };
const otherParams = { preset: true, scaleToFit: true, randomSeed: true };

/**
 * Receives the parameter template and checks that it is valid
 * @param {object} params - Parameter template from the design function
 */
const validateParams = params => {
  // Check all params
  for (let paramName in params) {
    const param = params[paramName];
    const { type: paramType, default: paramDefault } = param;

    // Check for all required properties
    for (let requiredKey of requiredKeys) {
      if (
        !hasKey(param, requiredKey) &&
        !(
          hasKey(requiredKeysExceptions, paramType) &&
          requiredKeysExceptions[paramType].includes(requiredKey)
        )
      ) {
        return `Parameter ${paramName} must have '${requiredKey}' property.`;
      }
    }

    // Check type is supported by Mechanic
    if (!hasKey(supportedTypes, paramType)) {
      return `Parameter of type ${paramType} not supported, expected either: ${Object.keys(
        supportedTypes
      )}.`;
    }

    // Check default value is of correct type to corresponding param type
    if (typeof paramDefault !== supportedTypes[paramType]) {
      return `Default property value invalid for parameter ${paramName} of type ${paramType}. Expected to be ${supportedTypes[paramType]}.`;
    }

    // Check that 'validation' property is function
    if (hasKey(param, "validation") && typeof param.validation !== "function") {
      return `Expected function in validation property in ${paramName}. Got ${typeof param.validation}.`;
    }

    // Check that 'editable' property is function
    if (
      hasKey(param, "editable") &&
      typeof param.editable !== "function" &&
      typeof param.editable !== "boolean"
    ) {
      return `Expected function or boolean in editable property in ${paramName}. Got ${typeof param.editable}.`;
    }

    // Check 'options' property
    if (hasKey(param, "options")) {
      const { options } = param;
      // Should be function or object
      if (!Array.isArray(options) && typeof options !== "object") {
        return `Expected array or object in options property in ${paramName}. Got ${typeof options}.`;
      }
      // If it's not an array, it's an object
      else if (!Array.isArray(options)) {
        // It should be consistent with 'default' property
        if (!Object.keys(options).includes(paramDefault)) {
          return `Default value ${paramDefault} for ${paramName} is not present in given options: ${Object.keys(
            options
          )}. `;
        }
        // All values should be consistent with the param type
        for (let option in options) {
          if (typeof options[option] !== supportedTypes[paramType]) {
            return `Incorrect type of value ${option} (${typeof options[
              option
            ]}) in options object for ${paramName}. Expected ${paramType}.`;
          }
        }
      }
      // If it's an array
      else if (Array.isArray(options)) {
        // It should be consistent with 'default' property
        if (!options.includes(paramDefault)) {
          return `Default value ${paramDefault} for ${paramName} is not present in given options: ${options} `;
        }
        // All values should be consistent with the param type
        for (let option of options) {
          if (typeof option !== supportedTypes[paramType]) {
            return `Incorrect type of value ${option} (${typeof option}) in options array for ${paramName}. Expected ${paramType}.`;
          }
        }
      }
    }
  }
  return null;
};

/**
 * Receives the parameters and values and validates that the values
 * are valid according to the template.
 * @param {object} params - Parameter template from the design function
 * @param {object} values - Values for some or all of the parameters
 */
const validateValues = (params, values = {}) => {
  for (let paramName in params) {
    const param = params[paramName];
    // Validate that values for options are specified in the template
    if (hasKey(values, paramName) && hasKey(param, "options")) {
      const { options } = param;
      if (Array.isArray(options) && !options.includes(values[paramName])) {
        return `Supplied ${paramName} parameter is not available in the template options: ${options}`;
      } else if (!Array.isArray(options) && !hasKey(options, values[paramName])) {
        return `Supplied ${paramName} parameter (${
          values[paramName]
        }) is not available in the template options: ${Object.keys(options)}`;
      }
    }
    // Run validation functions for values.
    if (hasKey(values, paramName) && hasKey(param, "validation")) {
      const error = param.validation(values[paramName]);
      if (error !== null && error !== undefined) {
        return `Param validation error returned: ${error}`;
      }
    }
  }

  // Check that there are not other values besides parameters and default params
  for (let paramName in values) {
    if (!hasKey(params, paramName) && !hasKey(otherParams, paramName)) {
      return `Unexpected ${paramName} value not defined on template.`;
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
 * Receives the parameters and values and returns an object with parameter
 * values (including defaults if value is missing) that can be passed to the
 * design function.
 * @param {object} params - Parameter template from the design function
 * @param {object} settings - Settings from the design function
 * @param {object} baseValues - Values for some or all of the parameters
 */
const prepareValues = (params, settings, baseValues) => {
  const values = Object.assign({}, baseValues);

  // Sets random seed
  if (settings.usesRandom) {
    if (values.randomSeed === undefined) {
      values.randomSeed = seedrandom(null, { global: true });
    }
    seedrandom(values.randomSeed, { global: true });
  }

  // Go through params and set values based on baseValues and defaults
  Object.entries(params).forEach(([name, param]) => {
    if (hasKey(param, "options")) {
      let value = baseValues[name] || param.default;
      if (Array.isArray(param.options)) {
        const index = param.options.indexOf(value);
        value = param.options[index];
      } else {
        value = param.options[value];
      }
      values[name] = value;
    } else {
      values[name] = baseValues[name] === undefined ? param.default : baseValues[name];
    }
  });

  // Scale down to fit if width and height are params
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
 * Validates that a DOM element is SVG or Canvas
 * @param {object} el - A DOM element to check
 */
const validateEl = el => {
  if (isSVG(el) || el instanceof HTMLCanvasElement) {
    return null;
  }
  return "Element passed to the frame() function must be SVGElement or HTMLCanvasElement";
};

export {
  isObject,
  hasKey,
  supportedTypes,
  validateParams,
  validateValues,
  validateSettings,
  prepareValues,
  isSVG,
  validateEl
};
