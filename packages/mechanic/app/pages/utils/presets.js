const NO_PRESET_VALUE = "-";
const DEFAULT_PRESET_VALUE = "default values";

const getPossiblePresets = presets =>
  [NO_PRESET_VALUE].concat(Object.keys(presets)).concat([DEFAULT_PRESET_VALUE]);

const addPresetsAsSources = (presetValue, presets, sources) => {
  if (presetValue === DEFAULT_PRESET_VALUE) {
    sources.push(
      Object.entries(params).reduce((source, param) => {
        if (param[1].default) source[param[0]] = param[1].default;
        else source[param[0]] = undefined;
        return source;
      }, {})
    );
  } else if (presetValue !== NO_PRESET_VALUE) {
    sources.push(presets[presetValue]);
  }
};

export { getPossiblePresets, addPresetsAsSources };
