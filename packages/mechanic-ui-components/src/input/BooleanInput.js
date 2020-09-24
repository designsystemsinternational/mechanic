import React, { useRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../uid";
import { Toggle } from "../buttons/Toggle";
import css from "./BooleanInput.css";

export const BooleanInput = props => {
  const _id = useRef(uid("boolean-input"));
  const {
    name,
    value,
    children,
    label,
    id = _id.current,
    className,
    variant,
    disabled,
    invalid,
    error,
    onChange,
    onFocus,
    onBlur
  } = props;

  const rootClasses = classnames(css.root, {
    [className]: className,
    [css[variant]]: variant,
    [css.invalid]: invalid,
    [css.disabled]: disabled
  });

  return (
    <div className={rootClasses}>
      {label && (
        <label className={css.label} htmlFor={id}>
          {label}
        </label>
      )}
      <Toggle
        name={name}
        id={id}
        className={css.toggle}
        status={value}
        onClick={e => onChange(e, name, !value)}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-describedby={`error-${id}`}
        aria-invalid={invalid}>
        {value ? "true" : "false"}
        {children}
      </Toggle>
      {invalid && error && (
        <div className={css.error} id={`error-${id}`} aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
};

BooleanInput.defaultProps = {
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {}
};

BooleanInput.propTypes = {
  name: PropTypes.string,
  value: PropTypes.bool,
  children: PropTypes.node,
  label: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
  error: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};
