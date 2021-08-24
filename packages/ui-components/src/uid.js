/**
 * Generate a UUID to use in component ID attributes
 * @param {string} prefix - Optional string prefix for the UUID
 */
export const uid = (prefix = "comp") => prefix + "-" + Math.random().toString(36).substring(2, 16);
