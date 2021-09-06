import React, { useState, useEffect, useRef } from "react";
import { ChromePicker } from "react-color";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../uid.js";
import { Button } from "../buttons/Button.js";
import { Invalid } from "../icons/index.js";

import * as commonCss from "../common.module.css";
import * as css from "./ColorInput.module.css";

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

  const classes = classnames(css.root, commonCss.root, {
    [className]: className,
    [commonCss.disabled]: disabled,
    [css.focus]: focus,
    [commonCss.focus]: focus,
    [commonCss.invalid]: invalid,
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

  // close picker when clicking outside of the input element
  useEffect(() => {
    if (!picking) return;
    const onClickOutside = e => {
      if (!e.target || !e.target.closest(`#${id}`)) {
        setPicking(false);
      }
    };

    const onKeyDown = e => {
      // close picker when typing enter or esc
      if (["Escape", "Enter"].includes(e.key)) {
        e.target.blur();
        setPicking(false);
      }
      // close picker on tab navigation
      if ("Tab" === e.key && e.target.closest(`#${id} .${css.chromePicker}`)) {
        setPicking(false);
      }
    };

    document.addEventListener("click", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [picking]);

  const handleOnClick = () => setPicking(picking => !picking);

  const handleOnChange = color => {
    onChange({}, name, colorToString(color, model));
  };

  return (
    <div className={classes}>
      {label && (
        <label className={commonCss.label} htmlFor={id}>
          {label}
        </label>
      )}
      <div
        id={id}
        className={commonCss.inputWrapper}
        aria-describedby={`error-${id}`}
        aria-invalid={invalid}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}>
        <Button
          className={classnames(commonCss.button, css.button)}
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
