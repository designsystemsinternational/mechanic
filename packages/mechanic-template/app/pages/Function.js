import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "../components/input/Select";
import Button from "../components/input/Button";
import Checkbox from "../components/input/Checkbox";
import css from "./Function.css";

const Function = ({ name, exports, children }) => {
  const [values, setValues] = useState({});
  const [fastPreview, setFastPreview] = useState(true);

  const mainRef = useRef();
  const randomSeed = useRef();
  const iframe = useRef();

  const { params } = exports;
  const {size, ...optional} = params;
  const sizes = Object.keys(size);

  // Init engine when the name of the function changes
  useEffect(() => {
    const onLoad = () => {
      iframe.current.contentWindow.initEngine(exports.settings.engine);
    };
    iframe.current.addEventListener("load", onLoad);
    return () => iframe.current.removeEventListener("load", onLoad);
  }, [name]);

  const handleOnChange = (e, name, value) => {
    setValues(Object.assign({}, values, { [name]: value }));
  };

  const handlePreview = async () => {
    const vals = Object.assign({}, values);
    if (fastPreview) {
      const bounds = mainRef.current.getBoundingClientRect();
      vals.scaleDownToFit = {
        width: bounds.width - 100,
        height: bounds.height - 100
      };
    }
    iframe.current.contentWindow.run(name, vals, true);
  };

  const handleExport = async () => {
    const vals = Object.assign({}, values);
    if (randomSeed.current) {
      vals.randomSeed = randomSeed.current;
    }
    iframe.current.contentWindow.run(name, vals);
  };

  return (
    <div className={css.root}>
      <aside>
        {children}
        <label>
          <span>size:</span> 
          <Select onChange={handleOnChange} name="size" value={values.size || "default"}>
            {sizes.map(size => (
              <option key={`size-${size}`} value={size}>
                {size} ({params.size[size].width}x{params.size[size].height})
              </option>
              ))}
          </Select>
        </label>
        <p>Params:</p>
        {
          Object.entries(optional).map(([key, value]) => (
            <Button>{key}</Button>
          ))
        }
        <br />
        <br />
        <Checkbox
          label="Fast Preview"
          checked={fastPreview}
          onChange={e => setFastPreview(e.target.checked)}
        />
        <br />
        <Button onClick={handlePreview}>Preview</Button>
        <Button onClick={handleExport}>Export</Button>
      </aside>
      <main ref={mainRef}>
        <iframe src="functions.html" className={css.iframe} ref={iframe} />
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