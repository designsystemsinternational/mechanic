import React, { Fragment, useRef, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../uid.js";
import { Select } from "../input/Select.js";
import * as css from "./OptionInput.module.css";

export const OptionInput = props => {
  const _id = useRef(uid("option-input"));
  const {
    name,
    type,
    options,
    value,
    children,
    label,
    id = _id.current,
    className,
    invalid,
    error,
    disabled,
    required,
    placeholder,
    onChange,
    onFocus,
    onBlur
  } = props;

  const arrayOfOptions = Array.isArray(options) ? options : Object.keys(options);

  const handleOnChange = event => {
    const value = type === "number" ? parseFloat(event.target.value) : event.target.value;
    onChange(event, name, value);
  };

  const rootClasses = classnames(css.root, {
    [className]: className
  });

  return (
    <Select
      name={name}
      value={value ? "" + value : value}
      label={label}
      id={id}
      className={rootClasses}
      invalid={invalid}
      error={error}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
      onChange={handleOnChange}
      onFocus={onFocus}
      onBlur={onBlur}>
      {arrayOfOptions.map(value => (
        <option key={`option-${name}-${value}`} value={value}>
          {value}
        </option>
      ))}
      {children}
    </Select>
  );
};

OptionInput.defaultProps = {
  placeholder: "Select option...",
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {}
};

OptionInput.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  options: PropTypes.any,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
  label: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  invalid: PropTypes.bool,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};
