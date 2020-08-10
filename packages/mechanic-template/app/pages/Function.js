import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Select from "../components/input/Select";
import Button from "../components/input/Button";
import ParamInput from "../components/ParamInput";
import css from "./Function.css";
import paramcss from "../components/ParamInput.css";

const Function = ({ name, exports, children }) => {
  const [values, setValues] = useState({});
  const [fastPreview, setFastPreview] = useState(true);

  const mainRef = useRef();
  const randomSeed = useRef();
  const iframe = useRef();

  const { params } = exports;
  const { size, ...optional } = params;
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
    setValues(values => Object.assign({}, values, { [name]: value }));
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
        <div className={css.sep} />
        {children}
        <div className={css.sep} />
        {Object.entries(optional).length == 0 ? "" : <div className={css.line} />}
        {Object.entries(optional).length == 0 ? (
          ""
        ) : (
          <div className={css.paramsWrapper}>
            <div className={css.params}>
              <div className={css.param}>
                <div className={classnames(css.row, css.strong)}>
                  <span>size</span>
                </div>
                <div className={css.row}>
                  <Select
                    className={classnames(paramcss.select, paramcss.grow)}
                    onChange={handleOnChange}
                    name="size"
                    value={values.size || "default"}>
                    {sizes.map(size => (
                      <option key={`size-${size}`} value={size}>
                        {size} ({params.size[size].width}x{params.size[size].height})
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              {Object.entries(optional).map(([name, param]) => (
                <div key={`param-${name}`} className={css.param}>
                  <div className={css.row}>
                    <span>{name}</span>
                  </div>
                  <div className={css.row}>
                    <ParamInput
                      name={name}
                      value={values[name]}
                      options={param}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className={css.sep} />
        <div className={css.line} />
        <div className={css.sep} />
        <div className={css.section}>
          <div className={classnames(css.row, css.strong)}>
            <Button
              status={fastPreview}
              variant="grow"
              onClick={() => setFastPreview(fastPreview => !fastPreview)}>
              {fastPreview ? "Fast Preview On" : "Fast Preview Off"}
            </Button>
          </div>
          <div className={css.sep} />
          <div className={classnames(css.row, css.strong)}>
            <Button variant="grow" onClick={handlePreview}>
              Preview
            </Button>
          </div>
          <div className={css.sep} />
          <div className={classnames(css.row, css.strong)}>
            <Button className={css.blue} variant="grow" onClick={handleExport}>
              Export
            </Button>
          </div>
        </div>
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
