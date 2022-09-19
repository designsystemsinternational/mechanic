export const DEFAULT_SETTINGS = {
  animated: false,
  persistRandomOnExport: true,
  optimize: true,
  hideFeedback: false,
  hideNavigation: false,
  hidePresets: false,
  hideScaleToFit: false,
  initialScaleToFit: true,
  hideAutoRefresh: false,
  initialAutoRefresh: true,
  hideGenerate: false,
  showMultipleExports: false,
  ignoreStyles: false,
  frameRate: 60,
  maxFrames: Infinity
};

/**
 * Creates a standardized settings object from user-provided settings.
 *
 * @param {object} settings - User-provided settings
 * @returns {object} - Standardized settings object
 */
export const mergeWithDefaultSettings = settings => {
  return Object.assign({}, DEFAULT_SETTINGS, settings);
};
