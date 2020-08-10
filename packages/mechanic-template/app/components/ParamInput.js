import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import css from "./ParamInput.css";
import Input from "./input/Input";
import Select from "./input/Select";
import Button from "./input/Button";

export const ParamInput = ({ name, value, options, onChange, children }) => {
  const { type, choices } = options;
  const _default = options["default"];

  if (choices) {
    return (
      <Select
        className={classnames(css.select, css.grow)}
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
    return (
      <Input
        type="number"
        // inputmode="numeric"
        className={classnames(css.number, css.grow)}
        label=""
        name={name}
        value={"" + (value === undefined ? _default : value)}
        onChange={onChange}>
        {children}
      </Input>
    );
  }

  if (type == "boolean") {
    const v = value === undefined ? _default : value;
    const onClickHandler = e => onChange(e, name, !v);
    return (
      <Button
        className={css.status}
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

  return (
    <Input
      type="text"
      className={classnames(css.text, css.grow)}
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
  value: PropTypes.any,
  options: PropTypes.object
};
