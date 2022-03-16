const NO_PRESET_VALUE = "Custom";
const DEFAULT_PRESET_VALUE = "Default values";

const getPossiblePresets = presets =>
  [NO_PRESET_VALUE].concat(Object.keys(presets)).concat([DEFAULT_PRESET_VALUE]);

const addPresetsAsSources = (inputValue, inputName, presets, inputs, values) => {
  const sources = [{ [inputName]: inputValue }];
  if (inputName === "preset") {
    if (inputValue === DEFAULT_PRESET_VALUE) {
      sources.push(
        Object.entries(inputs).reduce((source, input) => {
          source[input[0]] = input[1].default;
          return source;
        }, {})
      );
    } else if (inputValue !== NO_PRESET_VALUE) {
      sources.push(presets[inputValue]);
    }
  } else if (
    values.hasOwnProperty("preset") &&
    values.preset !== NO_PRESET_VALUE &&
    (values.preset === DEFAULT_PRESET_VALUE || presets[values.preset].hasOwnProperty(inputName))
  ) {
    sources.push({ preset: NO_PRESET_VALUE });
  }
  return sources;
};

export { getPossiblePresets, addPresetsAsSources, NO_PRESET_VALUE };
