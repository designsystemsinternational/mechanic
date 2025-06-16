import React from "react";
import {
  BooleanInput,
  NumberInput,
  OptionInput,
  ColorInput
} from "@mechanic-design/ui-components";

import * as css from "./style.module.css";

export const typeName = "groupToggle";

export const initValue = input => ({
  show: input.default,
  ...Object.fromEntries(
    Object.entries(input.inputs).map(([name, input]) => [name, input.default])
  )
});

export const prepareValue = (value, input) => {
  const v =
    value === undefined ||
    value === null ||
    !Object.keys(input.inputs).every(k => value.hasOwnProperty(k))
      ? initValue(input)
      : value;
  return v;
};

export const Input = props => {
  const { name, values, inputDef, onChange } = props;
  const { show, ...value } = values[name] ?? initValue(inputDef);

  return (
    <div className={css.root}>
      <BooleanInput
        label={inputDef.label}
        name="show"
        value={show}
        onChange={(e, _, v) => onChange(e, name, { ...value, show: v })}
      />
      {!show && (
        <div className={css.inputs}>
          {Object.entries(inputDef.inputs).map(([inputName, input], index) =>
            input.type === "number" ? (
              <NumberInput
                key={index}
                label={inputName}
                name={inputName}
                value={value[inputName]}
                slider
                min={input.min}
                max={input.max}
                step={input.step}
                onChange={(e, _, v) =>
                  onChange(e, name, { show, ...value, [inputName]: v })
                }
              />
            ) : input.type === "color" ? (
              <ColorInput
                key={index}
                label={inputName}
                name={inputName}
                value={value[inputName]}
                onChange={(e, _, v) =>
                  onChange(e, name, { show, ...value, [inputName]: v })
                }
              ></ColorInput>
            ) : (
              <OptionInput
                key={index}
                label={inputName}
                name={inputName}
                value={value[inputName]}
                options={input.options}
                onChange={(e, _, v) =>
                  onChange(e, name, { show, ...value, [inputName]: v })
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
};
