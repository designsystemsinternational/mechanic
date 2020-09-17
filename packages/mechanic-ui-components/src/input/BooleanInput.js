import React, { useRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Toggle } from "../buttons/Toggle";
import { uid } from "../utils";
import css from "./BooleanInput.css";

export const BooleanInput = props => {
  const _id = useRef(uid("input"));
  const {
    name,
    value,
    label,
    onChange,
    className,
    children,
    disabled,
    error,
    id = _id.current,
    invalid,
    variant
  } = props;

  const rootClasses = classnames(css.root, {
    [className]: className,
    [css.invalid]: invalid,
    [css.disabled]: disabled,
    [css[variant]]: variant
  });

  return (
    <div className={rootClasses}>
      {label && <label htmlFor={id}>{label}</label>}
      <Toggle name={name} id={id} status={value} onClick={e => onChange(e, name, !value)}>
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
  onChange: () => {}
};

BooleanInput.propTypes = {
  name: PropTypes.string,
  value: PropTypes.bool,
  label: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  id: PropTypes.string,
  invalid: PropTypes.bool,
  onChange: PropTypes.func,
  variant: PropTypes.string
};
