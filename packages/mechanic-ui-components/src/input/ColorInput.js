import React, { useState, useEffect, useRef } from "react";
import { ChromePicker } from "react-color";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../uid.js";
import { Button } from "../buttons/Button.js";
import * as css from "./ColorInput.module.css";

import { Invalid } from "../icons/index.js";

const colorToString = (color, model) => {
  if (model === "hex") {
    return color.hex;
  } else if (model === "rgba") {
    const { r, g, b, a } = color.rgb;
    const string = `rgba(${r},${g},${b},${a})`;
    return string;
  }
  return "#000";
};

export const ColorInput = props => {
  const _id = useRef(uid("boolean-input"));
  const {
    name,
    model,
    value,
    label,
    id = _id.current,
    className,
    invalid,
    disabled,
    error,
    onChange,
    onFocus,
    onBlur
  } = props;

  const [focus, setFocus] = useState(false);
  const [picking, setPicking] = useState(false);

  const classes = classnames(css.root, {
    [className]: className,
    [css.invalid]: invalid,
    [css.disabled]: disabled,
    [css.focus]: focus,
    [css.picking]: picking
  });

  const handleOnFocus = event => {
    onFocus && onFocus(event);
    setFocus(true);
  };

  const handleOnBlur = event => {
    onBlur && onBlur(event);
    setFocus(false);
  };

  // close picker when clicking outside of the element
  useEffect(() => {
    const onClickOutside = e => {
      if (!e.target.closest(`.${css.root}`)) {
        setPicking(false);
      }
    };
    document.addEventListener("click", onClickOutside);
    return () => {
      document.removeEventListener("click", onClickOutside);
    };
  }, []);

  const handleOnClick = () => setPicking(picking => !picking);

  const handleOnChange = color => {
    onChange({}, name, colorToString(color, model));
  };

  return (
    <div className={classes}>
      {label && (
        <label className={css.label} htmlFor={id}>
          {label}
        </label>
      )}
      <div
        id={id}
        className={css.buttonContainer}
        aria-describedby={`error-${id}`}
        aria-invalid={invalid}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}>
        <Button
          className={classnames(css.button, { [css.focus]: focus })}
          onClick={handleOnClick}
          disabled={disabled}>
          <span className={css.swatch} style={{ backgroundColor: value }} />
          <span className={css.value}>{value}</span>
        </Button>
        {picking && (
          <div className={css.popover}>
            <ChromePicker className={css.chromePicker} color={value} onChange={handleOnChange} />
          </div>
        )}
        <div className={css.suffix}>{invalid && <Invalid />}</div>
        {invalid && <div className={css.buttonBackground} />}
      </div>
      {invalid && error && (
        <div className={css.error} id={`error-${id}`} aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
};

ColorInput.defaultProps = {
  model: "rgba",
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {}
};

ColorInput.propTypes = {
  name: PropTypes.string,
  model: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.node,
  label: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  invalid: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};
