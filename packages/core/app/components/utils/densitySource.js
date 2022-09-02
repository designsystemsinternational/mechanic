import {
  DEFAULT_DENSITY,
  DENSITY_INPUT_NAME,
  EXPORT_DENSITIES
} from "../../../src/pixel-densities.js";

export const densityInput = {
  type: "text",
  label: "PNG Export pixel density",
  options: EXPORT_DENSITIES,
  default: DEFAULT_DENSITY
};

export const addDensitiesAsSources = (inputValue, inputName, values) => {
  const sources = [{ [inputName]: inputValue }];
  if (inputName === DENSITY_INPUT_NAME) {
    sources.push({ [DENSITY_INPUT_NAME]: inputValue });
  } else if (
    values.hasOwnProperty(DENSITY_INPUT_NAME) &&
    values.density !== DEFAULT_DENSITY &&
    values.density === inputValue
  ) {
    sources.push({ [DENSITY_INPUT_NAME]: DEFAULT_DENSITY });
  }
  return sources;
};
