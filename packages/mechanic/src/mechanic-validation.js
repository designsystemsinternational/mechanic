import seedrandom from "seedrandom";

const isObject = obj => !!(obj && typeof obj === "object");
const hasKey = (obj, key) => obj.hasOwnProperty(key);
const supportedTypes = { text: "string", number: "number", boolean: "boolean", color: "string" };
const requiredKeys = ["type", "default"];
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
      if (!hasKey(param, requiredKey)) {
        return `Parameter ${paramName} must have '${requiredKey}' property.`;
      }
    }

    // Check type is supported by Mechanic
    if (!hasKey(supportedTypes, paramType)) {
      return `Parameter of type ${paramType} not supported, expected: ${Object.keys(
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

    // Check that 'options' property
    if (hasKey(param, "options")) {
      // Should be function or object
      if (!Array.isArray(param.options) && typeof param.options !== "object") {
        return `Expected array or object in options property in ${paramName}. Got ${typeof param.options}.`;
      }
      // If it's not an array, it's an object
      else if (!Array.isArray(param.options)) {
        // It should be consistent with 'default' property
        if (!Object.keys(param.options).includes(paramDefault)) {
          return `Default value ${paramDefault} for ${paramName} is not present in given options. `;
        }
        // All values should be consistent with the param type
        for (let option in param.options) {
          if (typeof param.options[option] !== supportedTypes[paramType]) {
            return `Incorrect type of value in options object. Expected ${paramType}.`;
          }
        }
      }
      // If it's an array
      else if (Array.isArray(param.options)) {
        // It should be consistent with 'default' property
        if (!param.options.includes(paramDefault)) {
          return `Default value ${paramDefault} for ${paramName} is not present in given options. `;
        }
        // All values should be consistent with the param type
        for (let option of param.options) {
          if (typeof option !== supportedTypes[paramType]) {
            return `Incorrect type of value in options array. Expected ${paramType}.`;
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
  for (let param in params) {
    // Validate that values for options are specified in the template
    if (hasKey(values, param) && hasKey(params[param], "options")) {
      if (Array.isArray(params[param].options) && !params[param].options.includes(values[param])) {
        return `Supplied ${param} parameter is not available in the template options: ${params[param].options}`;
      } else if (
        !Array.isArray(params[param].options) &&
        !hasKey(params[param].options, values[param])
      ) {
        return `Supplied ${param} parameter (${
          values[param]
        }) is not available in the template options: ${Object.keys(params[param].options)}`;
      }
    }
    // Run validation functions for values.
    if (hasKey(values, param) && hasKey(params[param], "validation")) {
      const error = params[param].validation(values[param]);
      if (error !== null) {
        return `Param validation error: ${error}`;
      }
    }
  }

  // Check that there are not other values besides parameters and default params
  for (let param in values) {
    if (!hasKey(params, param) && !hasKey(otherParams, param)) {
      return `Unexpected ${param} value not defined on template.`;
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
