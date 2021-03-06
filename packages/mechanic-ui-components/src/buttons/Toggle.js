import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../uid.js";
import css from "./Toggle.css";

export const Toggle = props => {
  const _id = useRef(uid("toggle"));
  const {
    status,
    children,
    id = _id.current,
    className,
    variant,
    disabled,
    onClick,
    onFocus,
    onBlur
  } = props;
  const [focus, setFocus] = useState(false);
  const classes = classnames(css.root, {
    [className]: className,
    [css[variant]]: css[variant],
    [css.focus]: focus,
    [css.disabled]: disabled
  });

  const handleOnFocus = useRef(event => {
    onFocus && onFocus(event);
    setFocus(true);
  });

  const handleOnBlur = useRef(event => {
    onBlur && onBlur(event);
    setFocus(false);
  });

  return (
    <button
      id={id}
      className={classes}
      onClick={onClick}
      onFocus={handleOnFocus.current}
      onBlur={handleOnBlur.current}
      disabled={disabled}>
      <div className={classnames(css.status, { [css.on]: status })} />
      <span className={css.label}>{children}</span>
    </button>
  );
};

Toggle.defaultProps = {
  onClick: () => {},
  onFocus: () => {},
  onBlur: () => {}
};

Toggle.propTypes = {
  status: PropTypes.bool.isRequired,
  children: PropTypes.node,
  id: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};
