import React, { useRef } from "react";
import PropTypes from "prop-types";
import Case from "case";
import {
  BooleanInput,
  ColorInput,
  TextInput,
  NumberInput,
  OptionInput,
  ImageInput
} from "@mechanic-design/ui-components";
import { customComponents } from "../INPUTS";

const uid = (prefix = "comp") => prefix + "-" + Math.random().toString(36).substring(2, 16);

const baseComponents = {
  text: props => {
    const { inputDef } = props;
    const { options } = inputDef;
    if (options) {
      return <OptionInput {...props} options={options} />;
    }
    return <TextInput {...props} />;
  },
  number: props => {
    const { inputDef } = props;
    const { options, min, max, step, slider } = inputDef;
    if (options) {
      return <OptionInput {...props} options={options} />;
    }
    return <NumberInput min={min} max={max} step={step} slider={slider} {...props} />;
  },
  boolean: props => <BooleanInput {...props} />,
  color: props => {
    const { inputDef } = props;
    const { options, model } = inputDef;
    if (options) {
      return <OptionInput options={options} {...props} />;
    }
    return <ColorInput model={model} {...props} />;
  },
  image: props => {
    const { inputDef } = props;
    const { multiple } = inputDef;
    return <ImageInput multiple={multiple} {...props} />;
  }
};

export const Input = ({ name, className, values, inputDef, onChange, children }) => {
  const id = useRef(uid("mechanic-input"));
  const { type } = inputDef;
  if (type in customComponents) {
    const CustomComponent = customComponents[type];
    return (
      <div>
        <CustomComponent
          id={id}
          className={className}
          name={name}
          values={values}
          inputDef={inputDef}
          onChange={onChange}
        />
      </div>
    );
  }

  const { label: _label, validation, editable } = inputDef;
  const _default = inputDef["default"];
  const label = _label || Case.title(name);

  const value = values[name];
  const isEditable =
    editable === undefined ? true : typeof editable === "function" ? !!editable(values) : editable;
  const actualValue = value === undefined ? _default : value;
  const error = validation ? validation(values) : null;

  const Component = baseComponents[type] ?? (() => null);

  return (
    <Component
      name={name}
      value={actualValue}
      values={values}
      label={label}
      id={id.current}
      className={className}
      invalid={error ? true : false}
      error={error}
      disabled={!isEditable}
      onChange={onChange}
      inputDef={inputDef}>
      {children}
    </Component>
  );
};

Input.defaultProps = {
  onChange: () => {}
};

Input.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string,
  className: PropTypes.string,
  values: PropTypes.any,
  inputDef: PropTypes.object
};
