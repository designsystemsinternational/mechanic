import React, { Fragment, useRef, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Select } from "../input/Select";
import { uid } from "../utils";
import css from "./OptionInput.css";

export const OptionInput = props => {
  const _id = useRef(uid("option"));
  const {
    children,
    className,
    onChange,
    options,
    defaultValue,
    disabled,
    error,
    id = _id.current,
    invalid,
    label,
    name,
    placeholder,
    required,
    variant,
    value,
    type
  } = props;

  const arrayOfOptions = Array.isArray(options) ? options : Object.keys(options);

  const handleOnChange = event => {
    const value = type === "number" ? parseFloat(event.target.value) : event.target.value;
    onChange(event, name, value);
  };

  const rootClasses = classnames(css.root, {
    [className]: className,
    [css.focus]: focus,
    [css.invalid]: invalid,
    [css.disabled]: disabled,
    [css[variant]]: variant
  });

  return (
    <Select
      className={rootClasses}
      onChange={handleOnChange}
      name={name}
      label={name}
      id={id}
      value={"" + value}
      invalid={invalid}
      error={error}
      variant={variant}>
      {arrayOfOptions.map(value => (
        <option key={`option-${name}-${value}`} value={value}>
          {value}
        </option>
      ))}
      {children}
    </Select>
  );
};

OptionInput.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  type: PropTypes.string,
  options: PropTypes.any,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  invalid: PropTypes.bool,
  error: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  variant: PropTypes.string
};
