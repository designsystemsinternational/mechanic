import React, { useState, useRef } from "react";
import { ChromePicker } from "react-color";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../uid";
import { Button } from "../buttons/Button";
import css from "./ColorInput.css";

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
    variant,
    invalid,
    disabled,
    error,
    onChange,
    onFocus,
    onBlur
  } = props;
  const [picking, setPicking] = useState(false);

  const classes = classnames(css.root, {
    [className]: className,
    [css[variant]]: css[variant],
    [css.invalid]: invalid,
    [css.disabled]: disabled
  });

  const handleClick = () => setPicking(picking => !picking);

  const handleChange = color => {
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
        aria-invalid={invalid}>
        <Button className={css.button} onClick={handleClick} onFocus={onFocus} onBlur={onBlur}>
          <div className={css.swatch} style={{ backgroundColor: value }} />
          <span>{value}</span>
        </Button>
        {picking && (
          <div className={css.popover}>
            <ChromePicker className={css.chromePicker} color={value} onChange={handleChange} />
          </div>
        )}
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
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  invalid: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};
