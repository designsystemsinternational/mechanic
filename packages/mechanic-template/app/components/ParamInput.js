import React from 'react';
import PropTypes from 'prop-types';
import css from './ParamInput.css';
import Input from './input/Input';
import Select from './input/Select';

export const ParamInput = ({ name, values, options, onChange, children }) => {

    const {type ,choices} = options;
    const _default = options["default"];

    if (choices) {
      return (
        <Select onChange={onChange} name={name} value={values[name] || _default}>
          {options.choices.map(choice => (
            <option key={`$param-${name}-${choice}`} value={choice}>
              {choice}
            </option>
            ))}
        </Select>
      )
    }

    if (type == "integer") {
      return (
        <Input type="number" label="" name={name} value={"" + (values[name] || _default)} onChange={onChange}>
          {children}
        </Input>
      )
    }

    return (
      <Input type="text" label="" name={name} value={values[name] || _default} onChange={onChange}>
        {children}
      </Input>
    );
  };
  
  export default ParamInput;
  
  ParamInput.defaultProps = {
    onChange: () => {},
  };
  
  ParamInput.propTypes = {
    children: PropTypes.node,
    onChange: PropTypes.func,
    name: PropTypes.string,
    values: PropTypes.object,
    options: PropTypes.object,
  };