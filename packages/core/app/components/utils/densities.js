export const exportDensities = {
  "0.5x": 0.5,
  "0.75x": 0.75,
  "1x": 1,
  "2x": 2,
  "3x": 3,
  "4x": 4
};

export const DEFAULT_DENSITY = "1x";
export const DENSITY_INPUT_NAME = "exportDensity";

export const densityInput = {
  type: "text",
  options: exportDensities,
  default: DEFAULT_DENSITY
};

export const resolveDensity = density => {
  return exportDensities[density] ?? DEFAULT_DENSITY;
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
