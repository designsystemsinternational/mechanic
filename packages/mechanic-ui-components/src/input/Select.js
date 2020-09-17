import React, { Fragment, useRef, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../utils";
import css from "./Select.css";

export const Select = props => {
  const _id = useRef(uid("select"));
  const {
    children,
    className,
    onChange,
    onBlur,
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
    value
  } = props;
  const [focus, setFocus] = useState(false);

  const handleOnChange = useRef(event => {
    const { name, value } = event.target;
    onChange && onChange(event, name, value);
  });

  const handleOnBlur = useRef(() => {
    onBlur && onBlur();
    setFocus(false);
  });

  const rootClasses = classnames(css.root, {
    [className]: className,
    [css.focus]: focus,
    [css.invalid]: invalid,
    [css.disabled]: disabled,
    [css[variant]]: variant
  });

  return (
    <div className={rootClasses}>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        id={id}
        disabled={disabled}
        onChange={handleOnChange.current}
        onFocus={() => setFocus(true)}
        onBlur={handleOnBlur.current}
        name={name}
        placeholder={placeholder}
        value={value}
        invalid={error}
        aria-required={required}
        aria-describedby={`error-${id}`}
        aria-invalid={invalid}>
        <option disabled>{placeholder}</option>
        {children}
      </select>
      {invalid && error && (
        <div className={css.error} id={`error-${id}`} aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
};

Select.defaultProps = {
  placeholder: "Select..."
};

Select.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  invalid: PropTypes.bool,
  error: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  variant: PropTypes.string
};
