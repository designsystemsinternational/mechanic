import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../uid.js";
import css from "./TextInput.css";

export const TextInput = props => {
  const _id = useRef(uid("text-input"));
  const {
    name,
    value,
    label,
    id = _id.current,
    className,
    variant,
    invalid,
    error,
    disabled,
    required,
    placeholder,
    autocomplete,
    onChange,
    onKeyPress,
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
    [css.invalid]: invalid,
    [css.disabled]: disabled,
    [css.focus]: focus
  });

  return (
    <div className={rootClasses}>
      {label && (
        <label className={css.label} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type="text"
        name={name}
        value={value}
        id={id}
        className={css.input}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autocomplete}
        onChange={handleOnChange.current}
        onFocus={handleOnFocus.current}
        onBlur={handleOnBlur.current}
        onKeyPress={onKeyPress}
        aria-required={required}
        aria-describedby={`error-${id}`}
        aria-invalid={invalid}
      />
      {invalid && error && (
        <div className={css.error} id={`error-${id}`} aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
};

TextInput.defaultProps = {
  onChange: () => {},
  onKeyPress: () => {},
  onFocus: () => {},
  onBlur: () => {}
};

TextInput.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.string,
  invalid: PropTypes.bool,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  autocomplete: PropTypes.string,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};
