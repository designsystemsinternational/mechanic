import React, { useRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../uid.js";
import { Invalid } from "../icons/index.js";
import { Toggle } from "../buttons/Toggle.js";

import * as commonCss from "../common.module.css";
import * as css from "./BooleanInput.module.css";

export const BooleanInput = props => {
  const _id = useRef(uid("boolean-input"));
  const {
    name,
    value,
    children,
    label,
    id = _id.current,
    className,
    disabled,
    invalid,
    error,
    onChange,
    onFocus,
    onBlur
  } = props;

  const rootClasses = classnames(css.root, commonCss.root, {
    [className]: className,
    [commonCss.disabled]: disabled,
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
        <Toggle
          name={name}
          id={id}
          className={commonCss.button}
          status={value}
          disabled={disabled}
          onClick={e => onChange(e, name, !value)}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-describedby={`error-${id}`}
          aria-invalid={invalid}>
          {value ? "true" : "false"}
          {children}
        </Toggle>
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
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
  error: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};
