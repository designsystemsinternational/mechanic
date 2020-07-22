import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import css from './Radio.css';
import { uid } from '../utils';

export const Radio = (props) => {
  const _id = useRef(uid('radio'));
  const {
    name,
    value,
    label,
    checked,
    onChange,
    className,
    disabled,
    id = _id.current,
  } = props;
  const [focus, setFocus] = useState(false);

  const handleOnChange = useRef((event) => {
    const { name, value } = event.target;
    onChange && onChange(event, name, value);
  });

  return (
    <div
      className={classnames(css.root, {
        className: className,
        [css.focus]: focus,
        [css.checked]: checked,
        [css.disabled]: disabled,
      })}>
      <input
        checked={checked}
        id={id}
        name={name}
        onChange={handleOnChange.current}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        type="radio"
        value={value}
      />
      {label && <label htmlFor={id}>{label}</label>}
    </div>
  );
};

export default Radio;

Radio.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
};
