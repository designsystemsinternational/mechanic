import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { useValues } from "./utils/useValues.js";
import { getPossiblePresets, addPresetsAsSources, NO_PRESET_VALUE } from "./utils/presets.js";
import { useShortcuts } from "./utils/useShortcuts.js";

import { Button, Toggle, MechanicInput } from "@mechanic-design/ui-components";
import * as css from "./Function.module.css";

export const Function = ({ name, exports: functionExports, children }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [scaleToFit, setScaleToFit] = useState(true);
  const [autoRefreshOn, setAutoRefreshOn] = useState(true);

  const mainRef = useRef();
  const iframe = useRef();
  const lastRun = useRef();

  const {
    inputs,
    presets: exportedPresets,
    settings: { persistRandomOnExport }
  } = functionExports;
  const presets = getPossiblePresets(exportedPresets ?? {});
  const canScale = !!(inputs.width && inputs.height);
  const persistRandom = persistRandomOnExport === undefined || persistRandomOnExport;
  const [values, setValues] = useValues(name, inputs);
  const handleOnChange = (e, name, value) => {
    const sources = addPresetsAsSources(value, name, exportedPresets, inputs, values);
    setValues(values => Object.assign({}, values, ...sources));
  };

  const prepareValues = (useScale, useRandomSeed) => {
    const valuesCopy = Object.assign({}, values);
    if (useScale && canScale && scaleToFit) {
      const bounds = mainRef.current.getBoundingClientRect();
      valuesCopy.scaleToFit = {
        width: bounds.width - 100,
        height: bounds.height - 100
      };
    }
    if (useRandomSeed && lastRun.current?.values) {
      valuesCopy.randomSeed = lastRun.current.values.randomSeed;
    }
    return valuesCopy;
  };

  const handleScaleToFit = () => {
    setScaleToFit(!scaleToFit);
    iframe.current.contentWindow?.dispatchEvent?.(new CustomEvent('scaleToFit', { detail: { scaleToFit: !scaleToFit } }));
  };

  const handlePreview = async () => {
    const valuesCopy = prepareValues(true, false);
    lastRun.current = iframe.current.contentWindow?.run?.(name, valuesCopy, true);
  };

  const handleAutoPreview = async () => {
    const valuesCopy = prepareValues(true, true);
    lastRun.current = iframe.current.contentWindow?.run?.(name, valuesCopy, true);
  };

  const handleExport = async () => {
    const valuesCopy = prepareValues(false, true);
    iframe.current.contentWindow?.run?.(name, valuesCopy);
  };

  useEffect(() => {
    if (autoRefreshOn && iframeLoaded) handleAutoPreview();
  });

  // Check when iframe is done loading
  useEffect(() => {
    const onLoad = () => setIframeLoaded(true);
    iframe.current?.addEventListener?.("load", onLoad);
    return () => {
      iframe.current?.removeEventListener?.("load", onLoad);
    };
  }, [name]);

  useShortcuts(handleExport);

  return (
    <div className={css.root}>
      <aside className={css.aside}>
        <div className={css.section}>{children}</div>
        <div className={css.sep} />

        <div className={classnames(css.edge, css.top)} />
        <div className={css.inputs}>
          <MechanicInput
            className={css.input}
            key="input-preset"
            name="preset"
            values={values}
            attributes={{ type: "string", options: presets, default: NO_PRESET_VALUE }}
            onChange={handleOnChange}
          />
          {Object.entries(inputs).map(([name, input]) => (
            <MechanicInput
              className={css.input}
              key={`input-${name}`}
              name={name}
              values={values}
              attributes={input}
              onChange={handleOnChange}
            />
          ))}
        </div>
        <div className={classnames(css.edge, css.bottom)} />

        <div className={css.section}>
          <div className={css.row}>
            <Toggle
              status={canScale && scaleToFit}
              disabled={!canScale}
              onClick={handleScaleToFit}>
              {canScale ? (scaleToFit ? "Scale to fit On" : "Scale to fit Off") : "Scale to Fit"}
            </Toggle>
            {!canScale && <span className={css.error}>Inputs missing for scaling</span>}
          </div>
          <div className={css.sep} />
          <div className={css.row}>
            <Toggle
              className={css.grow}
              status={autoRefreshOn}
              onClick={() => setAutoRefreshOn(autoRefreshOn => !autoRefreshOn)}
              disabled={!iframeLoaded}>
              {iframeLoaded ? "Auto-refresh" : "Loading content"}
            </Toggle>
          </div>
          <div className={css.sep} />
          <div className={css.row}>
            <Button className={css.grow} onClick={handlePreview} disabled={!iframeLoaded}>
              {iframeLoaded
                ? persistRandom
                  ? "Preview / Randomize"
                  : "Preview"
                : "Loading content"}
            </Button>
          </div>
          <div className={css.sep} />
          <div className={css.row}>
            <Button
              className={css.grow}
              primary={iframeLoaded}
              onClick={handleExport}
              disabled={!iframeLoaded}>
              {iframeLoaded ? "Export" : "Loading content"}
            </Button>
          </div>
          <div className={css.sep} />
        </div>
      </aside>
      <main className={css.main} ref={mainRef}>
        <iframe
          title={`Design function ${name} document.`}
          src={`${name}.html`}
          className={css.iframe}
          ref={iframe}
        />
      </main>
    </div>
  );
};

Function.propTypes = {
  name: PropTypes.string.isRequired,
  exports: PropTypes.shape({
    handler: PropTypes.func.isRequired,
    inputs: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  })
};
