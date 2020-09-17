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
    required,
    variant
  } = props;
  const [focus, setFocus] = useState(false);

  const handleOnChange = useRef(event => {
    const { name, value } = event.target;
    onChange && onChange(event, name, parseFloat(value));
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
      {label && <label htmlFor={id}>{label}</label>}
      {slider ? (
        <div className={css["range-wrapper"]}>
          <span className={className.value}>{value}</span>
          <input
            autoComplete={autocomplete}
            id={id}
            name={name}
            type={"range"}
            value={"" + value}
            min={"" + min}
            max={"" + max}
            step={"" + step}
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
          value={"" + value}
          min={"" + min}
          max={"" + max}
          step={"" + step}
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
        <div className={css.error} id={`error-${id}`} aria-live="polite">
          {error}
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
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
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
  required: PropTypes.bool,
  variant: PropTypes.string
};
