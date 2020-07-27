import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import Select from "../components/input/Select";
import Button from "../components/input/Button";
import {
  validateParams,
  validateValues,
  validateSettings,
  createRunner,
  getTimeStamp
} from "../utils/mechanic";
import css from "./Function.css";

const Function = ({ name, exports, children }) => {
  const [values, setValues] = useState({});
  const canvasParent = useRef();

  const { handler, params, settings } = exports;
  validate(params, values, settings);

  const sizes = Object.keys(params.size);

  const handleOnChange = (e, name, value) => {
    setValues(Object.assign({}, values, { [name]: value }));
  };

  const handleRun = async () => {
    const runner = createRunner(handler, params, settings, values, {
      preview: true
    });
    runner.addEventListener("init", (el, finalParams) => {
      canvasParent.current.innerHTML = "";
      canvasParent.current.appendChild(el);
    });
    runner.run();
  };

  const handleDownload = async () => {
    const runner = createRunner(handler, params, settings, values);
    runner.addEventListener("init", (el, finalParams) => {
      // Show loading animation?
    });
    runner.addEventListener("frame", (el, finalParams) => {
      // Tick frames in loading animation?
    });
    runner.addEventListener("done", (el, finalParams) => {
      runner.download(`${name}-${getTimeStamp()}`);
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

const validate = (params, values, settings) => {
  const err1 = validateParams(params);
  if (err1) {
    throw err1;
  }

  const err2 = validateValues(params, values);
  if (err2) {
    throw err2;
  }

  const err3 = validateSettings(settings);
  if (err3) {
    throw err3;
  }
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
