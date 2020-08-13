import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import shortcut from "../utils/shortcut";
import Select from "../components/input/Select";
import Button from "../components/input/Button";
import Toggle from "../components/input/Toggle";
import ParamInput from "../components/ParamInput";
import css from "./Function.css";

const Function = ({ name, exports, children }) => {
  const [values, setValues] = useState({});
  const [fastPreview, setFastPreview] = useState(true);
  const [showPanel, setShowPanel] = useState(true);

  const mainRef = useRef();
  const randomSeed = useRef();
  const iframe = useRef();

  const { params } = exports;
  const { size, ...optional } = params;
  const sizes = Object.keys(size);

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

  // Init engine when the name of the function changes
  useEffect(() => {
    const onLoad = () => {
      iframe.current.contentWindow.initEngine(exports.settings.engine);
    };
    iframe.current.addEventListener("load", onLoad);
    return () => {
      iframe.current.removeEventListener("load", onLoad);
    };
  }, [name]);

  shortcut("mod+e", handleExport, iframe);
  shortcut("mod+p", handlePreview, iframe, true);
  shortcut("mod+f", () => setFastPreview(fastPreview => !fastPreview), iframe, true);
  shortcut("mod+y", () => setShowPanel(showPanel => !showPanel), iframe);

  return (
    <div className={css.root}>
      {showPanel && (
        <aside className={css.aside}>
          <div className={css.sep} />
          <div className={css.section}>{children}</div>
          <div className={css.sep} />
          <div className={css.line} />
          <div className={css.paramsWrapper}>
            <div className={css.params}>
              <div className={css.param}>
                <div className={classnames(css.row, css.strong)}>
                  <span className={classnames(css.grow, css.paramlabel)}>size</span>
                </div>
                <div className={css.row}>
                  <Select
                    className={css.grow}
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
                  <div className={classnames(css.row, css.strong)}>
                    <span className={classnames(css.grow, css.paramlabel)}>{name}</span>
                  </div>
                  <div className={css.row}>
                    <ParamInput
                      className={css.grow}
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
          <div className={css.line} />
          <div className={css.sep} />
          <div className={css.section}>
            <div className={classnames(css.row, css.strong)}>
              <Toggle
                className={css.grow}
                status={fastPreview}
                onClick={() => setFastPreview(fastPreview => !fastPreview)}>
                {fastPreview ? "Fast Preview On" : "Fast Preview Off"}
              </Toggle>
            </div>
            <div className={css.sep} />
            <div className={classnames(css.row, css.strong)}>
              <Button className={css.grow} onClick={handlePreview}>
                Preview
              </Button>
            </div>
            <div className={css.sep} />
            <div className={classnames(css.row, css.strong)}>
              <Button className={classnames(css.grow, css.blueHighlight)} onClick={handleExport}>
                Export
              </Button>
            </div>
          </div>
        </aside>
      )}
      <main className={css.main} ref={mainRef}>
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
