import React, { useRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import css from "./ParamInput.css";
import { TextInput } from "./input/TextInput";
import { NumberInput } from "./input/NumberInput";
import { BooleanInput } from "./input/BooleanInput";
import { OptionInput } from "./input/OptionInput";
import { ColorInput } from "./input/ColorInput";
import { uid } from "./uid";

export const ParamInput = ({ name, className, value, attributes, onChange, children }) => {
  const id = useRef(uid("param-input"));
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
        name={name}
        type={type}
        options={options}
        value={actualValue}
        label={name}
        id={id.current}
        className={rootClasses}
        variant="mechanic-param"
        onChange={onChange}
        invalid={error ? true : false}
        error={error}>
        {children}
      </OptionInput>
    );
  }

  if (type === "boolean") {
    return (
      <BooleanInput
        name={name}
        value={actualValue}
        label={name}
        id={id.current}
        className={rootClasses}
        variant="mechanic-param"
        invalid={error ? true : false}
        error={error}
        onChange={onChange}>
        {children}
      </BooleanInput>
    );
  }

  if (type === "color") {
    const { model } = attributes;
    return (
      <ColorInput
        name={name}
        model={model}
        value={actualValue}
        label={name}
        id={id.current}
        className={rootClasses}
        variant="mechanic-param"
        invalid={error ? true : false}
        error={error}
        onChange={onChange}>
        {children}
      </ColorInput>
    );
  }

  if (type === "number") {
    const { min, max, step, slider } = attributes;
    return (
      <NumberInput
        label={name}
        value={actualValue}
        name={name}
        id={id.current}
        className={rootClasses}
        variant="mechanic-param"
        invalid={error ? true : false}
        error={error}
        slider={slider}
        min={min}
        max={max}
        step={step}
        onChange={onChange}>
        {children}
      </NumberInput>
    );
  }

  return (
    <TextInput
      name={name}
      value={actualValue}
      label={name}
      id={id.current}
      className={rootClasses}
      variant="mechanic-param"
      invalid={error ? true : false}
      error={error}
      onChange={onChange}>
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
