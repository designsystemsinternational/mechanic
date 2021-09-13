import React, { Fragment, useRef, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../uid.js";
import { Dropdown } from "../icons/index.js";

import * as commonCss from "../common.module.css";
import * as css from "./Select.module.css";

export const Select = props => {
  const _id = useRef(uid("select"));
  const {
    name,
    value,
    children,
    label,
    id = _id.current,
    className,
    invalid,
    error,
    disabled,
    required,
    placeholder,
    onChange,
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

  const rootClasses = classnames(css.root, commonCss.root, {
    [className]: className,
    [commonCss.focus]: focus,
    [commonCss.invalid]: invalid,
    [commonCss.disabled]: disabled
  });

  return (
    <div className={rootClasses}>
      {label && (
        <label className={commonCss.label} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={commonCss.inputWrapper}>
        <select
          name={name}
          value={value}
          id={id}
          className={classnames(commonCss.input, css.select)}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          aria-required={required}
          aria-describedby={`error-${id}`}
          aria-invalid={invalid}>
          <option disabled>{placeholder}</option>
          {children}
        </select>
        <div className={commonCss.suffix}>
          <Dropdown open={false} />
        </div>
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

Select.defaultProps = {
  placeholder: "Select...",
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {}
};

Select.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.node,
  label: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  invalid: PropTypes.bool,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};
