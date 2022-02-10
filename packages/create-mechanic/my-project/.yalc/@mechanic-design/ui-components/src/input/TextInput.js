import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../uid.js";
import { Invalid } from "../icons/index.js";

import * as commonCss from "../common.module.css";
import * as css from "./TextInput.module.css";

export const TextInput = props => {
  const _id = useRef(uid("text-input"));
  const {
    name,
    value,
    label,
    id = _id.current,
    className,
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

  const handleOnChange = event => {
    const { name, value } = event.target;
    onChange && onChange(event, name, value);
  };

  const handleOnFocus = event => {
    onFocus && onFocus(event);
    setFocus(true);
  };

  const handleOnBlur = event => {
    onBlur && onBlur(event);
    setFocus(false);
  };

  const rootClasses = classnames(commonCss.root, {
    [className]: className,
    [commonCss.disabled]: disabled,
    [commonCss.focus]: focus,
    [commonCss.invalid]: invalid
  });

  return (
    <div className={rootClasses}>
      {label && (
        <label className={commonCss.label} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={commonCss.inputWrapper}>
        <input
          type="text"
          name={name}
          value={value}
          id={id}
          className={commonCss.input}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autocomplete}
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          onKeyPress={onKeyPress}
          aria-required={required}
          aria-describedby={`error-${id}`}
          aria-invalid={invalid}
        />
        <div className={commonCss.suffix}>{invalid && <Invalid />}</div>
        <div className={commonCss.background} />
      </div>
      {invalid && error && (
        <div className={commonCss.error} id={`error-${id}`} aria-live="polite">
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
