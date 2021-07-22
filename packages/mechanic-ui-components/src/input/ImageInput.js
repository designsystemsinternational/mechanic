import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../uid.js";
import { Button } from "../index.js";
import css from "./ImageInput.css";

export const ImageInput = props => {
  const _id = useRef(uid("text-input"));
  const {
    name,
    value,
    label,
    id = _id.current,
    className,
    variant,
    invalid,
    error,
    disabled,
    required,
    placeholder,
    autocomplete,
    formats,
    multiple,
    onChange,
    onKeyPress,
    onFocus,
    onBlur
  } = props;
  const ref = useRef();
  const [focus, setFocus] = useState(false);

  const handleOnChange = useRef(event => {
    const { name, files } = event.target;
    onChange && onChange(event, name, files);
  });

  const handleOnFocus = useRef(event => {
    onFocus && onFocus(event);
    setFocus(true);
  });

  const handleOnBlur = useRef(event => {
    onBlur && onBlur(event);
    setFocus(false);
  });

  const handleButtonClick = event => {
    ref.current?.click();
  };

  const rootClasses = classnames(css.root, {
    [className]: className,
    [css[variant]]: variant,
    [css.invalid]: invalid,
    [css.disabled]: disabled,
    [css.focus]: focus
  });

  const loadedImages = [];
  if (value) {
    console.log({ value });
    for (const file of value) {
      loadedImages.push(
        <img className={css.thumbnail} key={file.name} src={URL.createObjectURL(file)} />
      );
    }
  }

  return (
    <div className={rootClasses}>
      {label && (
        <label className={css.label} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={css.container}>
        <div className={css.loadedImages}>{loadedImages}</div>
        <input
          type="file"
          accept={formats ?? "image/*"}
          multiple={!!multiple}
          name={name}
          ref={ref}
          files={value}
          id={id}
          className={css.input}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autocomplete}
          onChange={handleOnChange.current}
          onFocus={handleOnFocus.current}
          onBlur={handleOnBlur.current}
          onKeyPress={onKeyPress}
          aria-required={required}
          aria-describedby={`error-${id}`}
          aria-invalid={invalid}
        />
        <Button className={css.browseButton} onClick={handleButtonClick}>
          +
        </Button>
      </div>
      {invalid && error && (
        <div className={css.error} id={`error-${id}`} aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
};

ImageInput.defaultProps = {
  onChange: () => {},
  onKeyPress: () => {},
  onFocus: () => {},
  onBlur: () => {}
};

ImageInput.propTypes = {
  name: PropTypes.string,
  value: PropTypes.object,
  label: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.string,
  invalid: PropTypes.bool,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  autocomplete: PropTypes.string,
  formats: PropTypes.string,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};
