import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { useValues } from "./utils/value-persistance";
import { useShortcuts } from "./utils/useShortcuts";

import { Button, Toggle, ParamInput } from "@designsystemsinternational/mechanic-ui-components";
import css from "./Controls.css";

export const Controls = ({ name, exports, children }) => {
  console.log({ name });
  const [scaleToFit, setScaleToFit] = useState(true);

  const mainRef = useRef();
  const iframe = useRef();
  const lastRun = useRef();

  const { params, presets: otherPresets } = exports;
  const presets = ["default"].concat(Object.keys(otherPresets ? otherPresets : {}));

  const [values, setValues] = useValues(name, params);

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

  const canScale = !!(params.width && params.height);

  const handlePreview = async () => {
    if (iframe.current.contentWindow.run === undefined) return;
    const vals = Object.assign({}, values);
    if (canScale && scaleToFit) {
      const bounds = mainRef.current.getBoundingClientRect();
      vals.scaleToFit = {
        width: bounds.width - 100,
        height: bounds.height - 100
      };
    }
    lastRun.current = iframe.current.contentWindow.run(name, vals, true);
  };

  const handleExport = async () => {
    if (iframe.current.contentWindow.run === undefined) return;
    const vals = Object.assign({}, values);
    if (lastRun.current && lastRun.current.values) {
      vals.randomSeed = lastRun.current.values.randomSeed;
    }
    iframe.current.contentWindow.run(name, vals);
  };

  // Init engine when the name of the function changes
  useEffect(() => {
    let onLoad;
    if (iframe.current && iframe.current.contentWindow && iframe.current.contentWindow.initEngine) {
      iframe.current.contentWindow.initEngine(name);
    } else if (iframe.current && iframe.current.contentWindow) {
      onLoad = () => {
        iframe.current.contentWindow.initEngine(name);
      };
      iframe.current.addEventListener("load", onLoad);
    }
    return () => {
      if (iframe.current && onLoad) iframe.current.removeEventListener("load", onLoad);
    };
  }, [name]);

  useShortcuts(handleExport);

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
