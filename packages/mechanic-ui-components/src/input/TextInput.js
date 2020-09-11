import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../utils";
import css from "./TextInput.css";

export const TextInput = props => {
  const _id = useRef(uid("input"));
  const {
    name,
    value,
    label,
    placeholder,
    onChange,
    onKeyPress,
    className,
    disabled,
    autocomplete,
    error,
    id = _id.current,
    invalid,
    required
  } = props;
  const [focus, setFocus] = useState(false);

  const handleOnChange = useRef(event => {
    const { name, value } = event.target;
    onChange && onChange(event, name, value);
  });

  const rootClasses = classnames(css.root, {
    [className]: className,
    [css.invalid]: invalid,
    [css.disabled]: disabled,
    [css.focus]: focus
  });

  return (
    <div className={rootClasses}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        autoComplete={autocomplete}
        id={id}
        name={name}
        type="text"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={handleOnChange.current}
        onKeyPress={onKeyPress}
        aria-required={required}
        aria-describedby={`error-${id}`}
        aria-invalid={invalid}
      />
      {invalid && error && (
        <div className={css.errorWrapper}>
          <span id={`error-${id}`} className={css.errorTxt} aria-live="polite">
            {error}
          </span>
        </div>
      )}
    </div>
  );
};

TextInput.defaultProps = {
  onChange: () => {},
  onKeyPress: () => {}
};

TextInput.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  autocomplete: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  id: PropTypes.string,
  invalid: PropTypes.bool,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool
};
