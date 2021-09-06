import React, { useCallback, useRef, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { uid } from "../uid.js";
import { Add } from "../icons/index.js";

import * as commonCss from "../common.module.css";
import * as css from "./ImageInput.module.css";

const ImageItem = ({ file, onPreview }) => {
  const src = useRef(URL.createObjectURL(file));
  return (
    <div className={css.imageItem}>
      <img
        className={css.thumbnail}
        src={src.current}
        onMouseEnter={() => onPreview(src.current)}
        onMouseLeave={() => onPreview(null)}
      />
    </div>
  );
};

export const ImageInput = props => {
  const _id = useRef(uid("text-input"));
  const {
    name,
    value,
    label,
    id = _id.current,
    className,
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
  const [preview, setPreview] = useState(null);

  const handleChangePreview = useCallback(value => setPreview(value), [setPreview]);

  const handleOnChange = event => {
    const { name, files } = event.target;
    onChange && onChange(event, name, multiple ? files : files[0]);
  };

  const handleOnFocus = event => {
    onFocus && onFocus(event);
    setFocus(true);
  };

  const handleOnBlur = event => {
    onBlur && onBlur(event);
    setFocus(false);
  };

  const handleButtonClick = () => {
    ref.current?.click();
  };

  const rootClasses = classnames(commonCss.root, {
    [className]: className,
    [commonCss.invalid]: invalid,
    [css.disabled]: disabled,
    [css.focus]: focus
  });

  // Check overflow property and how it behaves: https://developer.mozilla.org/en-US/docs/Web/CSS/overflow
  // Consider taking preview out from items and have a single preview element

  const loadedImages = [];
  if (value) {
    if (multiple) {
      for (const file of value) {
        loadedImages.push(
          <ImageItem
            key={file.name}
            file={file}
            onPreview={!disabled ? handleChangePreview : () => {}}
          />
        );
      }
    } else {
      loadedImages.push(
        <ImageItem
          key={value.name}
          file={value}
          onPreview={!disabled ? handleChangePreview : () => {}}
        />
      );
    }
  }

  return (
    <div className={rootClasses}>
      {label && (
        <label className={commonCss.label} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={css.containerWrapper}>
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
            tabIndex="-1"
            className={css.input}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autocomplete}
            onChange={handleOnChange}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            onKeyPress={onKeyPress}
            aria-required={required}
            aria-describedby={`error-${id}`}
            aria-invalid={invalid}
          />
          <button
            className={css.browseButton}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            onClick={handleButtonClick}
            disabled={disabled}>
            <Add className={css.plus} />
          </button>
        </div>
        <div className={commonCss.background} />
      </div>
      {preview && <img className={css.preview} src={preview} />}
      {invalid && error && (
        <div className={commonCss.error} id={`error-${id}`} aria-live="polite">
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
