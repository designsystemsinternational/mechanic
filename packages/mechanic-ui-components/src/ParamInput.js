import React, { useRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import css from "./ParamInput.css";
import { TextInput } from "./input/TextInput";
import { NumberInput } from "./input/NumberInput";
import { BooleanInput } from "./input/BooleanInput";
import { OptionInput } from "./input/OptionInput";
import { Select } from "./input/Select";
import { ColorInput } from "./input/ColorInput";
import { uid } from "./utils";

export const ParamInput = ({ name, className, value, attributes, onChange, children }) => {
  const _id = useRef(uid("input"));
  const { type, options, validation } = attributes;
  const _default = attributes["default"];

  const actualValue = value === undefined ? _default : value;
  const error = validation ? validation(actualValue) : null;

  const rootClasses = classnames(css.root, {
    [className]: className
  });

  if (options) {
    return (
      <OptionInput
        className={rootClasses}
        onChange={onChange}
        name={name}
        label={name}
        value={actualValue}
        type={type}
        options={options}
        invalid={error ? true : false}
        error={error}
        variant="mechanic">
        {children}
      </OptionInput>
    );
  }

  if (type === "boolean") {
    return (
      <BooleanInput
        className={rootClasses}
        onChange={onChange}
        name={name}
        label={name}
        value={actualValue}
        invalid={error ? true : false}
        error={error}
        variant="mechanic">
        {children}
      </BooleanInput>
    );
  }

  if (type === "color") {
    const { model } = attributes;
    return (
      <ColorInput
        className={rootClasses}
        name={name}
        label={name}
        id={_id.current}
        value={actualValue}
        model={model}
        onChange={onChange}
        invalid={error ? true : false}
        error={error}
        variant="mechanic">
        {children}
      </ColorInput>
    );
  }

  if (type === "number") {
    const { min, max, step, slider } = attributes;
    return (
      <NumberInput
        className={rootClasses}
        label={name}
        name={name}
        slider={slider}
        value={actualValue}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        invalid={error ? true : false}
        error={error}
        variant="mechanic">
        {children}
      </NumberInput>
    );
  }

  return (
    <TextInput
      className={rootClasses}
      label={name}
      name={name}
      value={actualValue}
      onChange={onChange}
      invalid={error ? true : false}
      error={error}
      variant="mechanic">
      {children}
    </TextInput>
  );
};

ParamInput.defaultProps = {
  onChange: () => {}
};

ParamInput.propTypes = {
  children: PropTypes.node,
  onChange: PropTypes.func,
  name: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.any,
  attributes: PropTypes.object
};
