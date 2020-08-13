import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { enablesShortcutsClass } from "../../utils/shortcut";
import { uid } from "../../utils";
import css from "./Input.css";

export const Input = props => {
  const _id = useRef(uid("input"));
  const {
    type,
    name,
    value,
    label,
    placeholder,
    onChange,
    onKeyPress,
    className,
    disabled,
    allowShortcuts,
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
        className={allowShortcuts ? enablesShortcutsClass : ""}
        name={name}
        type={type}
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

export default Input;

Input.defaultProps = {
  type: "text",
  onChange: () => {},
  onKeyPress: () => {},
  allowShortcuts: false
};

Input.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  autocomplete: PropTypes.string,
  disabled: PropTypes.bool,
  allowShortcuts: PropTypes.bool,
  error: PropTypes.string,
  id: PropTypes.string,
  invalid: PropTypes.bool,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool
};
