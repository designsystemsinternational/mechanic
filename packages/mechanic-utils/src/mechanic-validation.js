import seedrandom from "seedrandom";

const isObject = (obj) => obj && typeof obj === "object";
const hasKey = (obj, key) => obj.hasOwnProperty(key);
const supportedTypes = ["string", "integer", "boolean"];

/**
 * Receives the parameter template and checks that it is valid
 * @param {object} params - Parameter template from the design function
 */
const validateParams = (params) => {
  if (!isObject(params.size)) {
    return `Parameter template must have a size object`;
  }
  const { size, ...optionals } = params;
  if (!isObject(size.default)) {
    return `Parameter template must have default size`;
  }
  for (let param in optionals) {
    if (!hasKey(optionals[param], "type")) {
      return `Parameter ${param} must have ${key} property`;
    }
    if (!supportedTypes.includes(optionals[param].type)) {
      return `Parameter of type ${optionals[param].type} not supported, expected: ${supportedTypes}`;
    }
    if (!hasKey(optionals[param], "default")) {
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
const validateSettings = (settings) => {
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
  // Size
  const size = values.size || "default";
  const vals = Object.assign({}, values, {
    width: params.size[size].width,
    height: params.size[size].height,
  });

  // Scale down to fit
  if (values.scaleDownToFit) {
    const ratioWidth = values.scaleDownToFit.width
      ? values.scaleDownToFit.width / vals.width
      : 1;
    const ratioHeight = values.scaleDownToFit.height
      ? values.scaleDownToFit.height / vals.height
      : 1;
    if (ratioWidth < 1 || ratioHeight < 1) {
      const ratio = ratioWidth < ratioHeight ? ratioWidth : ratioHeight;
      vals.width = Math.floor(vals.width * ratio);
      vals.height = Math.floor(vals.height * ratio);
    }
  }

  // Random seed
  if (settings.usesRandom) {
    if (!vals.randomSeed) {
      vals.randomSeed = seedrandom(null, { global: true });
    }
    seedrandom(vals.randomSeed, { global: true });
  }

  // Other params

  Object.keys(params).forEach((key) => {
    if (key != "size") {
      let val = values[key] === undefined ? params[key].default : values[key];
      if (params[key].type == "integer") {
        vals[key] = parseInt(val);
      } else {
        vals[key] = val;
      }
    }
  });

  return vals;
};

/**
 * Validates that a DOM element is SVG or Canvas
 * @param {object} el - A DOM element to check
 */
const validateEl = (el) => {
  if (el instanceof SVGElement || el instanceof HTMLCanvasElement) {
    return null;
  }
  return "Element passed to the frame() function must be SVGElement or HTMLCanvasElement";
};

/**
 * Checks whether a DOM element is instance of SVGElement
 * @param {object} el - A DOM element to check
 */
const isSVG = (el) => el instanceof SVGElement;

export {
  isObject,
  hasKey,
  supportedTypes,
  validateParams,
  validateValues,
  validateSettings,
  prepareValues,
  isSVG,
  validateEl,
};
