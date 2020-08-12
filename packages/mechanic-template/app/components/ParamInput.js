import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import css from "./ParamInput.css";
import Input from "./input/Input";
import Select from "./input/Select";
import Button from "./input/Button";
import Toggle from "./input/Toggle";

export const ParamInput = ({ name, className, value, options, onChange, children }) => {
  const { type, choices } = options;
  const _default = options["default"];
  const rootClasses = classnames(css.root, {
    [className]: className
  });

  if (choices) {
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

  if (type == "boolean") {
    const v = value === undefined ? _default : value;
    return (
      <Toggle
        className={rootClasses}
        name={name}
        value={v}
        status={v}
        onClick={e => onChange(e, name, !v)}>
        {v ? "true" : "false"}
        {children}
      </Toggle>
    );
  }

  return (
    <Input
      type={type == "integer" ? "number" : "text"}
      className={rootClasses}
      label=""
      name={name}
      value={"" + (value === undefined ? _default : value)}
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
