import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { uid } from '../utils';
import classnames from 'classnames';
import css from './Checkbox.css';

export const Checkbox = (props) => {
  const _id = useRef(uid('checkbox'));
  const {
    className,
    checked,
    disabled,
    id = _id.current,
    label,
    name,
    value,
    onChange,
  } = props;

  const handleOnChange = useRef((event) => {
    const { name, checked } = event.target;
    const returnValue = checked ? value : false;
    onChange && onChange(event, name, returnValue);
  });

  return (
    <div
      className={classnames(css.root, {
        [className]: className,
        [css.checked]: checked,
        [css.disabled]: disabled,
      })}>
      <input
        checked={checked}
        disabled={disabled}
        id={id}
        name={name}
        onChange={handleOnChange.current}
        type="checkbox"
        value={value}
      />
      {label && <label htmlFor={id}>{label}</label>}
    </div>
  );
};
Checkbox.defaultProps = {
  value: true,
  onChange: () => {},
};
Checkbox.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Checkbox;
