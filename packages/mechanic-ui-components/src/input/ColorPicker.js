import React, { useState } from "react";
import { ChromePicker } from "react-color";
import PropTypes from "prop-types";
import classnames from "classnames";
import css from "./ColorPicker.css";

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

export const ColorPicker = ({ name, model, value, className, variant, onChange, disabled }) => {
  const [picking, setPicking] = useState(false);

  const classes = classnames(css.root, {
    [className]: className,
    [css[variant]]: css[variant]
  });

  const handleClick = () => setPicking(picking => !picking);

  const handleChange = color => {
    onChange({}, name, colorToString(color, model));
  };

  return (
    <div className={classes}>
      <button className={css.buttonContainer} onClick={handleClick}>
        <div className={css.swatch} style={{ backgroundColor: value }} />
        <span className={css.label}>{value}</span>
      </button>
      {picking && (
        <div className={css.popover}>
          <ChromePicker className={css.chromePicker} color={value} onChange={handleChange} />
        </div>
      )}
    </div>
  );
};

ColorPicker.defaultProps = {
  onChange: () => {},
  model: "rgba"
};

ColorPicker.propTypes = {
  name: PropTypes.string,
  model: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  variant: PropTypes.string
};
