import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import css from "./Toggle.css";

export const Toggle = ({ className, variant, status, onClick, children, disabled }) => {
  const classes = classnames(css.root, {
    [className]: className,
    [css[variant]]: css[variant]
  });
  return (
    <button className={classes} type="button" onClick={onClick} disabled={disabled}>
      <div className={classnames(css.status, { [css.on]: status })} />
      <span className={css.label}>{children}</span>
    </button>
  );
};

Toggle.defaultProps = {
  onClick: () => {}
};

Toggle.propTypes = {
  children: PropTypes.node,
  status: PropTypes.bool.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  variant: PropTypes.string
};
