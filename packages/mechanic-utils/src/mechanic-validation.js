import seedrandom from "seedrandom";

const isObject = obj => obj && typeof obj === "object";
const hasKey = (obj, key) => obj.hasOwnProperty(key);
const supportedTypes = { text: "string", number: "number", boolean: "boolean", color: "string" };
const requiredKeys = ["type", "default"];
const otherParams = { preset: true, scaleToFit: true };

/**
 * Receives the parameter template and checks that it is valid
 * @param {object} params - Parameter template from the design function
 */
const validateParams = params => {
  for (let param in params) {
    for (let requiredKey of requiredKeys) {
      if (!hasKey(params[param], requiredKey)) {
        return `Parameter ${param} must have '${requiredKey}' property.`;
      }
    }

    if (!hasKey(supportedTypes, params[param].type)) {
      return `Parameter of type ${params[param].type} not supported, expected: ${Object.keys(
        supportedTypes
      )}.`;
    }

    if (typeof params[param].default !== supportedTypes[params[param].type]) {
      return `Default property value invalid for parameter ${param} of type ${
        params[param].type
      }. Expected to be ${supportedTypes[params[param].type]}.`;
    }

    if (hasKey(params[param], "validation") && typeof params[param].validation !== "function") {
      return `Expected function in validation property in ${param}.`;
    }

    if (
      hasKey(params[param], "options") &&
      !Array.isArray(params[param].options) &&
      typeof params[param].options !== "object"
    ) {
      return `Expected array or object in options property in ${param}. Received ${typeof params[
        param
      ].options}`;
    } else if (hasKey(params[param], "options") && Array.isArray(params[param].options)) {
      for (let option of params[param].options) {
        if (typeof option !== supportedTypes[params[param].type]) {
          return `Incorrect type of value in options array. Expected ${params[param].type}.`;
        }
      }
      if (!params[param].options.includes(params[param].default)) {
        return `Default value ${params[param].default} for ${param} is not present in gieven options. `;
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
 * @param {object} values - Values for some or all of the parameters
 */
const prepareValues = (params, settings, values) => {
  const vals = Object.assign({}, values);

  // Random seed
  if (settings.usesRandom) {
    if (!vals.randomSeed) {
      vals.randomSeed = seedrandom(null, { global: true });
    }
    seedrandom(vals.randomSeed, { global: true });
  }

  // Params
  Object.entries(params).forEach(([name, param]) => {
    if (!hasKey(param, "options")) {
      vals[name] = values[name] === undefined ? param.default : values[name];
    } else {
      let val = values[name] || param.default;
      if (Array.isArray(param.options)) {
        const index = param.options.indexOf(val);
        val = param.options[index];
      } else {
        val = param.options[val];
      }
      vals[name] = val;
    }
  });

  // Scale down to fit if width and height are params
  if (values.scaleToFit && vals.width && vals.height) {
    const ratioWidth = values.scaleToFit.width ? values.scaleToFit.width / vals.width : 1;
    const ratioHeight = values.scaleToFit.height ? values.scaleToFit.height / vals.height : 1;
    if (ratioWidth < 1 || ratioHeight < 1) {
      const ratio = ratioWidth < ratioHeight ? ratioWidth : ratioHeight;
      vals.width = Math.floor(vals.width * ratio);
      vals.height = Math.floor(vals.height * ratio);
    }
  }
  return vals;
};

/**
 * Validates that a DOM element is SVG or Canvas
 * @param {object} el - A DOM element to check
 */
const validateEl = el => {
  if (el instanceof SVGElement || el instanceof HTMLCanvasElement) {
    return null;
  }
  return "Element passed to the frame() function must be SVGElement or HTMLCanvasElement";
};

/**
 * Checks whether a DOM element is instance of SVGElement
 * @param {object} el - A DOM element to check
 */
const isSVG = el => el instanceof SVGElement;

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
