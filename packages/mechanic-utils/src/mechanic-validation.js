import seedrandom from "seedrandom";

const isObject = obj => obj && typeof obj === "object";
const hasKey = (obj, key) => obj.hasOwnProperty(key);
const supportedTypes = ["string", "number", "boolean"];

/**
 * Receives the parameter template and checks that it is valid
 * @param {object} params - Parameter template from the design function
 */
const validateParams = params => {
  for (let param in params) {
    if (!hasKey(params[param], "type")) {
      return `Parameter ${param} must have ${key} property`;
    }
    if (!supportedTypes.includes(params[param].type)) {
      return `Parameter of type ${params[param].type} not supported, expected: ${supportedTypes}`;
    }
    if (!hasKey(params[param], "default")) {
      return `Parameter ${param} must have ${key} property`;
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
  // Validate that the size is specified in the template
  if (hasKey(values, "size") && !hasKey(params.size, values.size)) {
    return `Supplied size parameter is not available in the template: ${values.size}`;
  }

  // TODO: Check that there are not other values besides parameters and default params

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
    if (!param.options) {
      const val = values[name] === undefined ? param.default : values[name];
      if (param.type === "number") {
        vals[name] = parseFloat(val);
      } else {
        vals[name] = val;
      }
    } else {
      let val = values[name] || param.default.toString();
      if (Array.isArray(param.options)) {
        const index = param.options.map(o => o.toString()).indexOf(val);
        val = param.options[index];
      } else {
        val = param.options[val];
      }
      vals[name] = val;
    }
  });

  // Scale down to fit
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
