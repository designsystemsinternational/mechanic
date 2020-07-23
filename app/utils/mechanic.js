// These utils should probably be moved to a mechanic-utils package
const isObject = obj => obj && typeof obj === "object";
const hasKey = (obj, key) => obj.hasOwnProperty(key);

/**
 * Receives the parameter template and checks that it is valid
 * @param {object} params - Parameter template from the design function
 */
export const validateParameterTemplate = params => {
  if (!isObject(params.size)) {
    return `Parameter template must have a size object`;
  }
  if (!isObject(params.size.default)) {
    return `Parameter template must have default size`;
  }
  return null;
};

/**
 * Receives the parameters and values and validates that the values
 * are valid according to the template.
 * @param {object} params - Parameter template from the design function
 * @param {object} values - Values for some or all of the parameters
 */
export const validateParameterValues = (params, values = {}) => {
  // Validate that the size is specified in the template
  if (hasKey(values, "size") && !hasKey(params.size, values.size)) {
    return `Supplied size parameter is not available in the template: ${values.size}`;
  }
  return null;
};

/**
 * Receives the parameters and values and returns an object with parameter
 * values (including defaults if value is missing) that can be passed to the
 * design function.
 * @param {object} params - Parameter template from the design function
 * @param {object} values - Values for some or all of the parameters
 */
export const getParameterValues = (params, values = {}) => {
  const size = values.size || "default";
  return {
    size,
    width: params.size[size].width,
    height: params.size[size].height
  };
};

/**
 * Runs a design function
 * @param {object} func - The design function
 * @param {object} params - Parameter template from the design function
 * @param {object} values - Values for some or all of the parameters
 */
export const runDesignFunction = async (handler, params, values = {}) => {
  const finalParameters = getParameterValues(params, values);
  return await handler(finalParameters);
};
