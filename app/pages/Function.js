import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import Select from "../components/input/Select";
import Button from "../components/input/Button";
import {
  validateParameterTemplate,
  validateParameterValues,
  runDesignFunction
} from "../utils/mechanic";
import css from "./Function.css";

const Function = ({ exports, children }) => {
  const [values, setValues] = useState({});
  const canvasParent = useRef();

  const { parameters, handler } = exports;
  const err1 = validateParameterTemplate(parameters);
  if (err1) {
    throw err1;
  }

  const err2 = validateParameterValues(parameters, values);
  if (err2) {
    throw err2;
  }

  const sizes = Object.keys(parameters.size);

  const handleOnChange = (e, name, value) => {
    setValues(Object.assign({}, values, { [name]: value }));
  };

  const handleRun = () => {
    console.log("run");
    runDesignFunction(handler, parameters, values).then(el => {
      canvasParent.current.appendChild(el);
    });
  };

  const handleDownload = () => {
    console.log("download");
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
              {size} ({parameters.size[size].width}x
              {parameters.size[size].height})
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
  exports: PropTypes.shape({
    handler: PropTypes.func.isRequired,
    parameters: PropTypes.object.isRequired
  })
};

export default Function;
