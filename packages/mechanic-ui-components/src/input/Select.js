import React, { Fragment, useRef, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../uid";
import css from "./Select.css";

export const Select = props => {
  const _id = useRef(uid("select"));
  const {
    name,
    value,
    children,
    label,
    id = _id.current,
    className,
    variant,
    invalid,
    error,
    disabled,
    required,
    placeholder,
    onChange,
    onFocus,
    onBlur
  } = props;
  const [focus, setFocus] = useState(false);

  const handleOnChange = useRef(event => {
    const { name, value } = event.target;
    onChange && onChange(event, name, value);
  });

  const handleOnFocus = useRef(event => {
    onFocus && onFocus(event);
    setFocus(true);
  });

  const handleOnBlur = useRef(event => {
    onBlur && onBlur(event);
    setFocus(false);
  });

  const rootClasses = classnames(css.root, {
    [className]: className,
    [css[variant]]: variant,
    [css.focus]: focus,
    [css.invalid]: invalid,
    [css.disabled]: disabled
  });

  return (
    <div className={rootClasses}>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        name={name}
        value={value}
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        onChange={handleOnChange.current}
        onFocus={handleOnFocus.current}
        onBlur={handleOnBlur.current}
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
  placeholder: "Select...",
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {}
};

Select.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.node,
  label: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.string,
  invalid: PropTypes.bool,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};
