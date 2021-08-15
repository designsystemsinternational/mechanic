import React, { useRef, useState, useMemo } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../uid.js";
import { Invalid } from "../icons/index.js";
import * as css from "./NumberInput.module.css";

export const NumberInput = props => {
  const _id = useRef(uid("number-input"));
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

  const handleOnChange = event => {
    const { name, value } = event.target;
    const parsedValue = value === "" ? 0 : parseFloat(value);
    onChange && onChange(event, name, parsedValue);
  };

  const handleOnFocus = event => {
    onFocus && onFocus(event);
    setFocus(true);
  };

  const handleOnBlur = event => {
    onBlur && onBlur(event);
    setFocus(false);
  };

  const rootClasses = classnames(css.root, {
    [className]: className,
    [css.invalid]: invalid,
    [css.disabled]: disabled,
    [css.focus]: focus
  });

  // this is used to calculate how wide the number label should be on a range
  const maxDigits = useMemo(() => {
    let digits = max ? max.toString().length : 0;
    const stepParts = step ? step.toString().split(".") : [];
    digits += stepParts[1] ? stepParts[1].length : 0;
    return digits;
  }, [max, step]);

  return (
    <div className={rootClasses}>
      {label && (
        <label className={css.label} htmlFor={id}>
          {label}
        </label>
      )}
      {slider ? (
        <div className={css.rangeWrapper}>
          {value !== undefined && (
            <div
              style={{ flexBasis: maxDigits ? `${maxDigits * 0.8}em` : null }}
              className={css.rangeLabel}>
              {value}
            </div>
          )}
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
            onChange={handleOnChange}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            onKeyPress={onKeyPress}
            aria-required={required}
            aria-describedby={`error-${id}`}
            aria-invalid={invalid}
          />
          {invalid && <div className={css.buttonBackground} />}
        </div>
      ) : (
        <div className={css.inputWrapper}>
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
            onChange={handleOnChange}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            onKeyPress={onKeyPress}
            aria-required={required}
            aria-describedby={`error-${id}`}
            aria-invalid={invalid}
          />
          <div className={css.suffix}>{invalid && <Invalid />}</div>
          {invalid && <div className={css.buttonBackground} />}
        </div>
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
