import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../uid.js";
import * as commonCss from "../common.module.css";
import * as css from "./Button.module.css";

export const Button = props => {
  const _id = useRef(uid("button"));
  const {
    children,
    id = _id.current,
    className,
    primary,
    disabled,
    onClick,
    onFocus,
    onBlur
  } = props;
  const [focus, setFocus] = useState(false);
  const classes = classnames(css.root, commonCss.button, {
    [className]: className,
    [css.primary]: primary,
    [commonCss.focus]: focus && !disabled,
    [commonCss.disabled]: disabled
  });

  // set focus to false when disabled
  useEffect(() => {
    setFocus(false);
  }, [disabled]);

  const handleOnFocus = event => {
    onFocus && onFocus(event);
    setFocus(true);
  };

  const handleOnBlur = event => {
    onBlur && onBlur(event);
    setFocus(false);
  };

  return (
    <button
      id={id}
      className={classes}
      onClick={onClick}
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
      disabled={disabled}
      tabIndex={disabled ? "-1" : undefined}>
      <span>{children}</span>
    </button>
  );
};

Button.defaultProps = {
  onClick: () => {},
  onFocus: () => {},
  onBlur: () => {}
};

Button.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
  className: PropTypes.string,
  primary: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};
