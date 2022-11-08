import React, { useRef, useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../uid.js";
import { Invalid } from "../icons/index.js";

import { useShiftKey } from "../util/useShiftKey.js";

import * as commonCss from "../common.module.css";
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
  const [internalValue, setInternalValue] = useState(value);
  const rangeError = useRef(null);
  const isShiftPressed = useShiftKey();
  const [focus, setFocus] = useState(false);

  // TODO: This validation needs to be moved outside the component up to the
  // parent. We just need to make sure to stop event propagation on error at the
  // parent level, so we do not cause a Mechanic Error to be thrown.
  const isInRange = v => {
    if (min !== undefined && v < min) {
      rangeError.current = `Must be at least ${min}`;
      return false;
    }
    if (max !== undefined && v > max) {
      rangeError.current = `Must be at most ${max}`;
      return false;
    }
    rangeError.current = null;
    return true;
  };

  // TODO: Refactor, so this lives inside the parent
  const computedInvalid = useMemo(() => {
    return invalid || rangeError.current !== null;
  }, [invalid, rangeError.current]);

  const computedError = useMemo(() => {
    return error || rangeError.current;
  }, [error, rangeError.current]);

  // When shift is pressed, we want to increment/decrement by 10x the step
  const computedStep = useMemo(() => {
    if (step !== undefined) {
      return step * (isShiftPressed ? 10 : 1);
    }
    return isShiftPressed ? 10 : 1;
  }, [step, isShiftPressed]);

  const handleOnChange = event => {
    const { name, value } = event.target;
    const parsedValue = value === "" ? 0 : parseFloat(value);
    setInternalValue(parsedValue);

    if (isInRange(parsedValue)) {
      onChange && onChange(event, name, parsedValue);
    }
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
    [css.disabled]: disabled,
    [commonCss.focus]: focus,
    [commonCss.invalid]: invalid,
    [css.focus]: focus
  });

  // this is used to calculate how wide the number label should be on a range
  const maxDigits = useMemo(() => {
    let digits = max ? max.toString().length : 0;
    const stepParts = step ? step.toString().split(".") : [];
    // Add 1 to the decimal digits count to compensate for the decimal point
    digits += stepParts[1] ? stepParts[1].length + 1 : 0;
    return digits;
  }, [max, step]);

  // this is used to pad the value with trailing zeros
  const decimalDigits = useMemo(() => {
    const stepParts = step ? step.toString().split(".") : [];
    return stepParts[1] ? stepParts[1].length : 0;
  }, [step]);

  return (
    <div className={rootClasses}>
      {label && (
        <label className={commonCss.label} htmlFor={id}>
          {label}
        </label>
      )}
      {slider ? (
        <div className={css.rangeWrapper}>
          {value !== undefined && (
            <input
              style={{ flexBasis: maxDigits ? `${maxDigits}ch` : null }}
              className={classnames(css.rangeNumberInput)}
              type={"number"}
              onChange={handleOnChange}
              min={min ? "" + min : min}
              max={max ? "" + max : max}
              step={computedStep ? "" + computedStep : computedStep}
              name={name}
              value={internalValue.toFixed(decimalDigits)}
            />
          )}
          <input
            type={"range"}
            tabIndex="-1"
            name={name}
            value={internalValue ? "" + internalValue : internalValue}
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
          {invalid && (
            <div className={classnames(css.background, commonCss.background)} />
          )}
        </div>
      ) : (
        <div className={commonCss.inputWrapper}>
          <input
            type={"number"}
            name={name}
            value={internalValue ? "" + internalValue : internalValue}
            id={id}
            className={classnames(commonCss.input, css.numberInput)}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autocomplete}
            min={min ? "" + min : min}
            max={max ? "" + max : max}
            step={computedStep ? "" + computedStep : computedStep}
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
      )}
      {computedInvalid && computedError && (
        <div className={commonCss.error} id={`error-${id}`} aria-live="polite">
          {computedError}
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
