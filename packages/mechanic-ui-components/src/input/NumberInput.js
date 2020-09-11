import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../utils";
import css from "./NumberInput.css";

export const NumberInput = props => {
  const _id = useRef(uid("input"));
  const {
    name,
    value,
    label,
    min,
    max,
    step,
    slider,
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
      {slider ? (
        <div className={css["range-wrapper"]}>
          <span>{value}</span>
          <input
            autoComplete={autocomplete}
            id={id}
            name={name}
            type={"range"}
            value={value}
            min={min}
            max={max}
            step={step}
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
        </div>
      ) : (
        <input
          autoComplete={autocomplete}
          id={id}
          name={name}
          type={"number"}
          value={value}
          min={min}
          max={max}
          step={step}
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
      )}
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

NumberInput.defaultProps = {
  onChange: () => {},
  onKeyPress: () => {}
};

NumberInput.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  min: PropTypes.string,
  max: PropTypes.string,
  step: PropTypes.string,
  slider: PropTypes.bool,
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
