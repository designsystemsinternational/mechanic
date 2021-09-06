const NO_PRESET_VALUE = "-";
const DEFAULT_PRESET_VALUE = "default values";

const getPossiblePresets = presets =>
  [NO_PRESET_VALUE].concat(Object.keys(presets)).concat([DEFAULT_PRESET_VALUE]);

const addPresetsAsSources = (presetValue, presets, inputs, sources) => {
  if (presetValue === DEFAULT_PRESET_VALUE) {
    sources.push(
      Object.entries(inputs).reduce((source, input) => {
        if (input[1].default) source[input[0]] = input[1].default;
        else source[input[0]] = undefined;
        return source;
      }, {})
    );
  } else if (presetValue !== NO_PRESET_VALUE) {
    sources.push(presets[presetValue]);
  }
};

export { getPossiblePresets, addPresetsAsSources };
