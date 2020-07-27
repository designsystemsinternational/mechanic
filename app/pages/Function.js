import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import Select from "../components/input/Select";
import Button from "../components/input/Button";
import {
  validateParameterTemplate,
  validateParameterValues,
  createRunner,
  getTimeStamp
} from "../utils/mechanic";
import { download } from "../utils/download";
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
    const runner = createRunner(handler, params, values);
    runner.addEventListener("init", (el, finalParams) => {
      // clear
      canvasParent.current.appendChild(el);
    });
    runner.addEventListener("done", (el, finalParams) => {
      // Only insert if init has not run
      canvasParent.current.appendChild(el);
    });
    runner.run();
  };

  const handleDownload = async () => {
    const runner = createRunner(handler, params, values);
    runner.addEventListener("init", (el, finalParams) => {
      // Show loading animation?
    });
    runner.addEventListener("frame", (el, finalParams) => {
      // Tick frames in loading animation?
    });
    runner.addEventListener("done", (el, finalParams) => {
      const fileName = `${name}-${getTimeStamp()}`;
      download(el, fileName);
    });
    runner.run();
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
    params: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  })
};

export default Function;
