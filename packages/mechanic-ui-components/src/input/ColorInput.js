import React, { useState } from "react";
import { ChromePicker } from "react-color";
import PropTypes from "prop-types";
import classnames from "classnames";
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

export const ColorInput = ({
  name,
  model,
  value,
  label,
  id,
  invalid,
  error,
  className,
  variant,
  onChange,
  disabled
}) => {
  const [picking, setPicking] = useState(false);

  const classes = classnames(css.root, {
    [className]: className,
    [css.invalid]: invalid,
    [css[variant]]: css[variant]
  });

  const handleClick = () => setPicking(picking => !picking);

  const handleChange = color => {
    onChange({}, name, colorToString(color, model));
  };

  return (
    <div className={classes}>
      {label && <label htmlFor={id}>{label}</label>}
      <div className={css.buttonContainer}>
        <button onClick={handleClick}>
          <div className={css.swatch} style={{ backgroundColor: value }} />
          <span className={css.label}>{value}</span>
        </button>
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
  onChange: () => {},
  model: "rgba"
};

ColorInput.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  id: PropTypes.string,
  invalid: PropTypes.bool,
  onChange: PropTypes.func,
  variant: PropTypes.string,
  model: PropTypes.string
};
