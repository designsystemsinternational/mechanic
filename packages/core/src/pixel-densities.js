// Inpsired by the options Figma is offering
export const EXPORT_DENSITIES = {
  "0.5x": 0.5,
  "0.75x": 0.75,
  "1x": 1,
  "2x": 2,
  "3x": 3,
  "4x": 4
};

export const DEFAULT_DENSITY = "1x";
export const DENSITY_INPUT_NAME = "exportDensity";

/**
 * Resolves a density by its name or returns the default
 * density if no match is found.
 *
 * @param{string} density - The density name
 * @returns{number} The density value
 */
export const resolveDensity = density => {
  return EXPORT_DENSITIES[density] ?? DEFAULT_DENSITY;
};
