import React, { useRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import css from "./ParamInput.css";
import { TextInput } from "./input/TextInput.js";
import { NumberInput } from "./input/NumberInput.js";
import { BooleanInput } from "./input/BooleanInput.js";
import { OptionInput } from "./input/OptionInput.js";
import { ColorInput } from "./input/ColorInput.js";
import { uid } from "./uid.js";

export const ParamInput = ({ name, className, values, attributes, onChange, children }) => {
  const id = useRef(uid("param-input"));
  const { type, options, validation, editable } = attributes;
  const _default = attributes["default"];

  const value = values[name];
  const isEditable =
    editable === undefined ? true : typeof editable === "function" ? editable(values) : editable;
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
        invalid={error ? true : false}
        error={error}
        disabled={!isEditable}
        onChange={onChange}>
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
        disabled={!isEditable}
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
        disabled={!isEditable}
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
        disabled={!isEditable}
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
      disabled={!isEditable}
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
  values: PropTypes.any,
  attributes: PropTypes.object
};
