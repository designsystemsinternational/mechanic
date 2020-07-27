// These utils should probably be moved to a mechanic-utils package
const isObject = obj => obj && typeof obj === "object";
const hasKey = (obj, key) => obj.hasOwnProperty(key);

/**
 * Returns a timestamp to be used in a filename
 */
export const getTimeStamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  const hour = `${now.getHours()}`.padStart(2, "0");
  const minute = `${now.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}-${hour}-${minute}`;
};

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
 * Creates a runner for a design function
 * @param {object} func - The design function
 * @param {object} params - Parameter template from the design function
 * @param {object} values - Values for some or all of the parameters
 */
export const createRunner = (handler, params, values = {}) => {
  const finalParams = getParameterValues(params, values);
  const runner = createEventDispatcher();
  runner.run = () => {
    handler(finalParams, {
      init: el => runner.dispatch("init", [el, finalParams]),
      frame: el => runner.dispatch("frame", [el, finalParams]),
      done: el => runner.dispatch("done", [el, finalParams])
    });
  };
  return runner;
};

/**
 * Creates an event dispatcher
 */
export const createEventDispatcher = () => {
  const listeners = {};
  return {
    addEventListener: (eventName, func) => {
      if (!listeners.hasOwnProperty(eventName)) {
        listeners[eventName] = [];
      }
      listeners[eventName].push(func);
    },
    removeEventListener: (eventName, func) => {
      if (!listeners.hasOwnProperty(eventName)) {
        return;
      }
      const idx = listeners[eventName].findIndex(f => f === func);
      if (idx > -1) {
        listeners[eventName].splice(idx, 1);
      }
    },
    dispatch: (eventName, eventData) => {
      if (!listeners.hasOwnProperty(eventName)) {
        return;
      }
      for (let listener of listeners[eventName]) {
        listener.apply(this, eventData);
      }
    }
  };
};
