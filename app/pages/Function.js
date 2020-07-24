import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import Select from "../components/input/Select";
import Button from "../components/input/Button";
import {
  validateParameterTemplate,
  validateParameterValues,
  runDesignFunction,
  getTimeStamp,
  download
} from "../utils/mechanic";
import css from "./Function.css";

const Function = ({ name, exports, children }) => {
  const [values, setValues] = useState({});
  const canvasParent = useRef();

  const { params, handler } = exports;
  const err1 = validateParameterTemplate(params);
  if (err1) {
    throw err1;
  }

  const err2 = validateParameterValues(params, values);
  if (err2) {
    throw err2;
  }

  const sizes = Object.keys(params.size);

  const handleOnChange = (e, name, value) => {
    setValues(Object.assign({}, values, { [name]: value }));
  };

  const handleRun = async () => {
    const [el, finalParams] = await runDesignFunction(handler, params, values);
    canvasParent.current.appendChild(el);
  };

  const handleDownload = async () => {
    const [el, finalParams] = await runDesignFunction(handler, params, values);
    const fileName = `${name}-${getTimeStamp()}`;
    await download(el, finalParams, fileName);
  };

  return (
    <div className={css.root}>
      <aside>
        {children}
        <Select
          onChange={handleOnChange}
          name="size"
          value={values.size || "default"}>
          {sizes.map(size => (
            <option key={`size-${size}`} value={size}>
              {size} ({params.size[size].width}x{params.size[size].height})
            </option>
          ))}
        </Select>
        <Button onClick={handleRun}>Run</Button>
        <Button onClick={handleDownload}>Download</Button>
      </aside>
      <main>
        <div ref={canvasParent}></div>
      </main>
    </div>
  );
};

Function.propTypes = {
  name: PropTypes.string.isRequired,
  exports: PropTypes.shape({
    handler: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired
  })
};

export default Function;
