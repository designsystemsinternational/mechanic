import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../uid";
import css from "./NumberInput.css";

export const NumberInput = props => {
  const _id = useRef(uid("number-input"));
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
    min,
    max,
    step,
    slider,
    onChange,
    onKeyPress,
    onFocus,
    onBlur
  } = props;
  const [focus, setFocus] = useState(false);

  const handleOnChange = useRef(event => {
    const { name, value } = event.target;
    const parsedValue = parseFloat(value);
    onChange && !isNaN(parsedValue) && onChange(event, name, parsedValue);
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
    [css.invalid]: invalid,
    [css.disabled]: disabled,
    [css.focus]: focus,
    [css[variant]]: variant
  });

  return (
    <div className={rootClasses}>
      {label && (
        <label className={css.label} htmlFor={id}>
          {label}
        </label>
      )}
      {slider ? (
        <div className={css["range-wrapper"]}>
          {value !== undefined && <span className={css.rangeLabel}>{value}</span>}
          <input
            type={"range"}
            name={name}
            value={value ? "" + value : value}
            id={id}
            className={css.rangeInput}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autocomplete}
            min={min ? "" + min : min}
            max={max ? "" + max : max}
            step={step ? "" + step : step}
            onChange={handleOnChange.current}
            onFocus={handleOnFocus.current}
            onBlur={handleOnBlur.current}
            onKeyPress={onKeyPress}
            aria-required={required}
            aria-describedby={`error-${id}`}
            aria-invalid={invalid}
          />
        </div>
      ) : (
        <input
          type={"number"}
          name={name}
          value={value ? "" + value : value}
          id={id}
          className={css.numberInput}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autocomplete}
          min={min ? "" + min : min}
          max={max ? "" + max : max}
          step={step ? "" + step : step}
          onChange={handleOnChange.current}
          onFocus={handleOnFocus.current}
          onBlur={handleOnBlur.current}
          onKeyPress={onKeyPress}
          aria-required={required}
          aria-describedby={`error-${id}`}
          aria-invalid={invalid}
        />
      )}
      {invalid && error && (
        <div className={css.error} id={`error-${id}`} aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
};

NumberInput.defaultProps = {
  onChange: () => {},
  onKeyPress: () => {},
  onFocus: () => {},
  onBlur: () => {}
};

NumberInput.propTypes = {
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  slider: PropTypes.bool,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};
