import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Mousetrap from "mousetrap";

import { Button, Toggle, ParamInput } from "mechanic-ui-components";
import "mechanic-ui-components/dist/mechanic.css";

import css from "./Function.css";

export const Function = ({ name, exports, children }) => {
  const [values, setValues] = useState({ preset: "default" });
  const [scaleToFit, setScaleToFit] = useState(true);

  const mainRef = useRef();
  const randomSeed = useRef();
  const iframe = useRef();

  const { params, presets: otherPresets } = exports;
  const presets = ["default"].concat(Object.keys(otherPresets ? otherPresets : {}));

  const handleOnChange = (e, name, value) => {
    const sources = [{ [name]: value }];
    if (name === "preset") {
      if (value === "default") {
        sources.push(
          Object.entries(params).reduce((source, param) => {
            source[param[0]] = param[1].default;
            return source;
          }, {})
        );
      } else {
        sources.push(otherPresets[value]);
      }
    }
    setValues(values => Object.assign({}, values, ...sources));
  };

  const canScale = params.width && params.height;

  const handlePreview = async () => {
    const vals = Object.assign({}, values);
    if (canScale && scaleToFit) {
      const bounds = mainRef.current.getBoundingClientRect();
      vals.scaleToFit = {
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
      iframe.current.contentWindow.initEngine(name);
    };
    iframe.current.addEventListener("load", onLoad);
    return () => {
      iframe.current.removeEventListener("load", onLoad);
    };
  }, [name]);

  useEffect(() => {
    Mousetrap.bind("command+e", handleExport);
    return () => {
      Mousetrap.unbind("command+e");
    };
  });

  return (
    <div className={css.root}>
      <aside className={css.aside}>
        <div className={css.sep} />
        <div className={css.section}>{children}</div>
        <div className={css.sep} />
        <div className={css.line} />
        <div className={css.paramsWrapper}>
          <div className={css.params}>
            <ParamInput
              className={css.param}
              key="param-preset"
              name="preset"
              value={values.preset}
              attributes={{ type: "string", options: presets, default: presets[0] }}
              onChange={handleOnChange}
            />
            {Object.entries(params).map(([name, param]) => (
              <ParamInput
                className={css.param}
                key={`param-${name}`}
                name={name}
                value={values[name]}
                attributes={param}
                onChange={handleOnChange}
              />
            ))}
          </div>
        </div>
        <div className={css.line} />
        <div className={css.sep} />
        <div className={css.section}>
          <div className={classnames(css.row, css.strong)}>
            <Toggle
              className={css.grow}
              status={canScale && scaleToFit}
              disabled={!canScale}
              onClick={() => setScaleToFit(scaleToFit => !scaleToFit)}>
              {canScale
                ? scaleToFit
                  ? "Scale to fit On"
                  : "Scale to fit Off"
                : "Params missing for scaling"}
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
