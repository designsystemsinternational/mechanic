import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import css from "./ParamInput.css";
import Input from "./input/Input";
import Select from "./input/Select";
import Button from "./input/Button";

export const ParamInput = ({ name, className, value, options, onChange, children }) => {
  const { type, choices } = options;
  const _default = options["default"];

  if (choices) {
    const rootClasses = classnames(css.root, css.select, {
      [className]: className
    });
    return (
      <Select
        className={rootClasses}
        onChange={onChange}
        name={name}
        value={value === undefined ? _default : value}>
        {options.choices.map(choice => (
          <option key={`$param-${name}-${choice}`} value={choice}>
            {choice}
          </option>
        ))}
      </Select>
    );
  }

  if (type == "integer") {
    const rootClasses = classnames(css.root, css.number, {
      [className]: className
    });
    return (
      <Input
        type="number"
        className={rootClasses}
        label=""
        name={name}
        value={"" + (value === undefined ? _default : value)}
        onChange={onChange}>
        {children}
      </Input>
    );
  }

  if (type == "boolean") {
    const rootClasses = classnames(css.root, css.status, {
      [className]: className
    });
    const v = value === undefined ? _default : value;
    const onClickHandler = e => onChange(e, name, !v);
    return (
      <Button
        className={rootClasses}
        variant="grow"
        name={name}
        value={v}
        status={v}
        onClick={onClickHandler}>
        {v ? "true" : "false"}
        {children}
      </Button>
    );
  }

  const rootClasses = classnames(css.root, css.text, {
    [className]: className
  });

  return (
    <Input
      type="text"
      className={rootClasses}
      label=""
      name={name}
      value={value === undefined ? _default : value}
      onChange={onChange}>
      {children}
    </Input>
  );
};

export default ParamInput;

ParamInput.defaultProps = {
  onChange: () => {}
};

ParamInput.propTypes = {
  children: PropTypes.node,
  onChange: PropTypes.func,
  name: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.any,
  options: PropTypes.object
};
