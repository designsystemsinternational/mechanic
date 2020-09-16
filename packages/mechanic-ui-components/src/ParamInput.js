import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import css from "./ParamInput.css";
import { TextInput } from "./input/TextInput";
import { NumberInput } from "./input/NumberInput";
import { Select } from "./input/Select";
import { Toggle } from "./input/Toggle";
import { ColorPicker } from "./input/ColorPicker";
import { uid } from "./utils";

export const ParamInput = ({ name, className, value, attributes, onChange, children }) => {
  const [error, setError] = useState();
  const _id = useRef(uid("input"));
  const { type, options } = attributes;
  const _default = attributes["default"];
  const rootClasses = classnames(css.root, {
    [className]: className
  });
  const currentValue = value === undefined ? _default : value;

  if (options) {
    const arrayOfOptions = Array.isArray(options) ? options : Object.keys(options);
    const handleOnChange = event => {
      const value = type === "number" ? parseFloat(event.target.value) : event.target.value;
      onChange(event, name, value);
    };
    return (
      <Select
        className={rootClasses}
        onChange={handleOnChange}
        name={name}
        label={name}
        invalid={error}
        error={error}
        value={"" + currentValue}
        // onBlur={() => setError(value != "default" ? value : null)}
      >
        {arrayOfOptions.map(value => (
          <option key={`$param-${name}-${value}`} value={value}>
            {value}
          </option>
        ))}
        {children}
      </Select>
    );
  }

  if (type === "boolean") {
    const v = value !== undefined ? value : _default;
    return (
      <div className={rootClasses}>
        <label htmlFor={_id}>{name}</label>
        <Toggle
          name={name}
          id={_id}
          status={currentValue}
          onClick={e => onChange(e, name, !currentValue)}>
          {currentValue ? "true" : "false"}
          {children}
        </Toggle>
      </div>
    );
  }

  if (type === "number") {
    const { min, max, step, slider } = attributes;
    return (
      <NumberInput
        className={rootClasses}
        label={name}
        name={name}
        slider={slider}
        value={currentValue}
        min={min}
        max={max}
        step={step}
        onChange={onChange}>
        {children}
      </NumberInput>
    );
  }

  if (type === "color") {
    const { model } = attributes;
    return (
      <div className={rootClasses}>
        <label htmlFor={_id}>{name}</label>
        <ColorPicker name={name} value={currentValue} model={model} onChange={onChange} />
        {children}
      </div>
    );
  }

  return (
    <TextInput
      className={rootClasses}
      label={name}
      name={name}
      value={currentValue}
      onChange={onChange}>
      {children}
    </TextInput>
  );
};

ParamInput.defaultProps = {
  onChange: () => {}
};

ParamInput.propTypes = {
  children: PropTypes.node,
  onChange: PropTypes.func,
  name: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.any,
  attributes: PropTypes.object
};
