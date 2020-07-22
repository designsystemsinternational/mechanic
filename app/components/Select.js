import React, { Fragment, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { uid } from '../utils';
import css from './Select.css';

export const Select = (props) => {
  const _id = useRef(uid('select'));
  const {
    children,
    className,
    defaultValue,
    disabled,
    error,
    id = _id.current,
    invalid,
    label,
    name,
    placeholder,
    required,
    value,
  } = props;
  const [focus, setFocus] = useState(false);

  const handleOnChange = useRef((event) => {
    const { name, value } = event.target;
    onChange && onChange(event, name, value);
  });

  const rootClasses = classnames(css.root, {
    [className]: className,
    [css.focus]: focus,
    [css.withLabel]: label,
    [css.invalid]: invalid,
    [css.disabled]: disabled,
  });

  return (
    <Fragment>
      <div className={rootClasses}>
        {label && (
          <label htmlFor={id}>
            <span>{label}:</span>
          </label>
        )}
        <select
          id={id}
          disabled={disabled}
          onChange={handleOnChange.current}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          name={name}
          placeholder={placeholder}
          value={value}
          aria-required={required}
          aria-describedby={`error-${id}`}
          aria-invalid={invalid}>
          <option disabled>{placeholder}</option>
          {children}
        </select>
      </div>
      {invalid && error && (
        <div className={css.error} id={`error-${id}`} aria-live="polite">
          {error}
        </div>
      )}
    </Fragment>
  );
};

export default Select;

Select.defaultProps = {
  placeholder: 'Select...',
};

Select.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  id: PropTypes.string,
  invalid: PropTypes.bool,
  label: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};
