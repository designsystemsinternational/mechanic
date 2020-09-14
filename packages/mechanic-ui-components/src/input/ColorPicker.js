import React, { useState } from "react";
import { ChromePicker } from "react-color";
import PropTypes from "prop-types";
import classnames from "classnames";
import css from "./ColorPicker.css";

export const ColorPicker = ({ name, value, className, variant, onChange, disabled }) => {
  const [picking, setPicking] = useState(false);

  const classes = classnames(css.root, {
    [className]: className,
    [css[variant]]: css[variant]
  });

  const handleClick = () => {
    setPicking(picking => !picking);
  };

  const handleClose = () => setPicking(false);

  const handleChange = color => {
    onChange({}, name, color.hex);
  };

  return (
    <div className={classes}>
      <button className={css.buttonContainer} onClick={handleClick}>
        <div className={css.swatch} style={{ backgroundColor: value }} />
        <span>{value}</span>
      </button>
      {picking && (
        <div className={css.popover}>
          {/* <div className={css.cover} onClick={handleClose} /> */}
          <ChromePicker className={css.chromePicker} color={value} onChange={handleChange} />
        </div>
      )}
    </div>
  );
};

ColorPicker.defaultProps = {
  onChange: () => {}
};

ColorPicker.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  variant: PropTypes.string
};
