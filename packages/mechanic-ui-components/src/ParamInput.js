import React, { useState, useRef, useEffect } from "react";
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
  const _id = useRef(uid("input"));
  const { type, options, validation } = attributes;
  const _default = attributes["default"];

  const actualValue = value === undefined ? _default : value;
  const error = validation ? validation(actualValue) : null;

  const rootClasses = classnames(css.root, {
    [className]: className,
    [css.invalid]: error ? true : false
  });

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
        value={"" + actualValue}
        invalid={error ? true : false}
        error={error}
        variant="mechanic">
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
    return (
      <div className={rootClasses}>
        <label htmlFor={_id.current}>{name}</label>
        <Toggle
          name={name}
          id={_id.current}
          status={actualValue}
          onClick={e => onChange(e, name, !actualValue)}
          invalid={error ? true : false}
          error={error}>
          {actualValue ? "true" : "false"}
          {children}
        </Toggle>
        {error && (
          <div className={css.error} id={`error-${_id.current}`} aria-live="polite">
            {error}
          </div>
        )}
      </div>
    );
  }

  if (type === "color") {
    const { model } = attributes;
    return (
      <div className={rootClasses}>
        <label htmlFor={_id.current}>{name}</label>
        <ColorPicker
          name={name}
          id={_id.current}
          value={actualValue}
          model={model}
          onChange={onChange}
        />
        {children}
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
        value={actualValue}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        invalid={error ? true : false}
        error={error}
        variant="mechanic">
        {children}
      </NumberInput>
    );
  }

  return (
    <TextInput
      className={rootClasses}
      label={name}
      name={name}
      value={actualValue}
      onChange={onChange}
      invalid={error ? true : false}
      error={error}
      variant="mechanic">
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
