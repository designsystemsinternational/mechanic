import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import * as css from "./Feedback.module.css";

export const Feedback = ({ className, href, variant, onClick, children, disabled }) => {
  const classes = classnames(css.root, {
    [className]: className,
    [css[variant]]: css[variant]
  });

  return href ? (
    <button className={classes}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </button>
  ) : (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Feedback;

Feedback.defaultProps = {
  onClick: () => {}
};

Feedback.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  variant: PropTypes.string
};
