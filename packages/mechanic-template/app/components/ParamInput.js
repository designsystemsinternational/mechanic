import React from "react";
import PropTypes from "prop-types";
import css from "./ParamInput.css";
import Input from "./input/Input";
import Select from "./input/Select";
import Button from "./input/Button";

export const ParamInput = ({ name, value, options, onChange, children }) => {
  const { type, choices } = options;
  const _default = options["default"];

  if (choices) {
    return (
      <Select onChange={onChange} name={name} value={value || _default}>
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
        label=""
        name={name}
        value={"" + (value || _default)}
        onChange={onChange}>
        {children}
      </Input>
    );
  }

  if (type == "boolean") {
    const v = value === undefined ? _default : value;
    const onClickHandler = e => onChange(e, name, !v);
    return (
      <Button className={css.status} name={name} value={v} status={v} onClick={onClickHandler}>
        {v ? "true" : "false"}
        {children}
      </Button>
    );
  }

  return (
    <Input type="text" label="" name={name} value={value || _default} onChange={onChange}>
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
