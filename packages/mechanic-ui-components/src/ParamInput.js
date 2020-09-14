import React, { useRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import css from "./ParamInput.css";
import { TextInput } from "./input/TextInput";
import { NumberInput } from "./input/NumberInput";
import { Select } from "./input/Select";
import { Toggle } from "./input/Toggle";
import { ColorPicker } from "./input/ColorPicker";
import { uid } from "./utils";

export const ParamInput = ({ name, className, value, attributes, onChange, children }) => {
  const _id = useRef(uid("input"));
  const { type, options } = attributes;
  const _default = attributes["default"];
  const rootClasses = classnames(css.root, {
    [className]: className
  });

  if (options) {
    const arrayOfOptions = Array.isArray(options)
      ? options.map(option => option.toString())
      : Object.keys(options);
    return (
      <Select
        className={rootClasses}
        onChange={onChange}
        name={name}
        label={name}
        value={value || _default.toString()}>
        {arrayOfOptions.map(value => (
          <option key={`$param-${name}-${value}`} value={value}>
            {value}
          </option>
        ))}
      </Select>
    );
  }

  if (type === "boolean") {
    const v = value !== undefined ? value : _default;
    return (
      <div className={rootClasses}>
        <label htmlFor={_id}>{name}</label>
        <Toggle name={name} id={_id} value={v} status={v} onClick={e => onChange(e, name, !v)}>
          {v ? "true" : "false"}
          {children}
        </Toggle>
      </div>
    );
  }

  if (type === "color") {
    const { model } = attributes;
    return (
      <div className={rootClasses}>
        <label htmlFor={_id}>{name}</label>
        <ColorPicker name={name} value={value || _default} model={model} onChange={onChange} />
      </div>
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
        value={"" + (value || _default)}
        min={"" + min}
        max={"" + max}
        step={"" + step}
        onChange={onChange}>
        {children}
      </NumberInput>
    );
  }

  return (
    <TextInput
      className={rootClasses}
      label={name}
      name={name}
      value={value || _default}
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
