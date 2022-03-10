import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import { useIframeLoaded } from "./utils/useIframeLoaded.js";
import { useValues } from "./utils/useValues.js";
import { getPossiblePresets, NO_PRESET_VALUE } from "./utils/presets.js";
import { useShortcuts } from "./utils/useShortcuts.js";
import { useSeedHistory } from "./utils/useSeedHistory.js";

import { Button, Toggle } from "@mechanic-design/ui-components";
import { Input } from "./Input.js";
import { useInteractiveInputs } from "./utils/useInteractiveInputs.js";

import * as css from "./SideBar.module.css";

export const SideBar = ({ name, exports: functionExports, iframe, mainRef, children }) => {
  const [scaleToFit, setScaleToFit] = useState(true);
  const [autoRefreshOn, setAutoRefreshOn] = useState(true);
  const [lastRun, setLastRun] = useState(null);
  const [seedHistory, setSeedHistory] = useSeedHistory(name);

  const iframeLoaded = useIframeLoaded(iframe, name);

  const {
    inputs,
    presets: exportedPresets,
    settings: { persistRandomOnExport, showStateExport }
  } = functionExports;
  const presets = getPossiblePresets(exportedPresets ?? {});
  const canScale = !!(inputs.width && inputs.height);
  const persistRandom = persistRandomOnExport === undefined || persistRandomOnExport;

  const [values, setValues] = useValues(name, inputs, exportedPresets);
  const handleOnChange = (e, name, value) => setValues(name, value);

  const getRunConfig = (lastRun, isPreview, random, scale) => ({
    isPreview,
    lastRun,
    boundingClient: mainRef.current.getBoundingClientRect(),
    scale: scale && canScale && scaleToFit,
    randomSeed: random
  });

  const preview = async () => {
    const run = iframe.current.contentWindow?.run;
    setLastRun(lastRun =>
      run?.(name, values, getRunConfig(lastRun, true, seedHistory.current, true))
    );
  };

  const handleExport = async () => {
    const run = iframe.current.contentWindow?.run;
    setLastRun(lastRun =>
      run?.(name, values, getRunConfig(lastRun, false, seedHistory.current, false))
    );
  };

  const handleDownloadState = async () => {
    lastRun.downloadState(name);
  };

  useEffect(() => {
    if (autoRefreshOn && iframeLoaded) preview();
  }, [values, autoRefreshOn, iframeLoaded, scaleToFit]);

  useEffect(() => {
    preview();
  }, [seedHistory.current]);

  useInteractiveInputs(inputs, iframe, handleOnChange);
  useShortcuts(handleExport);

  return (
    <aside className={css.root}>
      <div className={css.section}>{children}</div>
      <div className={css.sep} />

      <div className={cn(css.edge, css.top)} />
      <div className={css.inputs}>
        <Input
          className={css.input}
          key="input-preset"
          name="preset"
          values={values}
          inputDef={{ type: "text", options: presets, default: NO_PRESET_VALUE }}
          onChange={handleOnChange}
        />
        {Object.entries(inputs).map(([name, input]) => (
          <Input
            className={css.input}
            key={`input-${name}`}
            name={name}
            values={values}
            inputDef={input}
            onChange={handleOnChange}
          />
        ))}
      </div>
      <div className={cn(css.edge, css.bottom)} />

      <div className={css.section}>
        <div className={css.row}>
          <Toggle
            status={canScale && scaleToFit}
            disabled={!canScale || lastRun === undefined}
            onClick={() => setScaleToFit(scaleToFit => !scaleToFit)}>
            Scale to Fit
          </Toggle>
          {!canScale && <span className={css.error}>Inputs missing for scaling</span>}
        </div>
        <div className={css.sep} />
        <div className={css.row}>
          <Toggle
            className={css.grow}
            status={autoRefreshOn}
            onClick={() => setAutoRefreshOn(autoRefreshOn => !autoRefreshOn)}
            disabled={!iframeLoaded || lastRun === undefined}>
            Auto-refresh
          </Toggle>
        </div>
        <div className={css.sep} />
        <div className={cn(css.row, css.noWrapRow)}>
          {persistRandom && (
            <Button
              className={cn(css.grow, css.historyButton)}
              onClick={() => setSeedHistory.undo()}
              disabled={!iframeLoaded || !setSeedHistory.canUndo || lastRun === undefined}>
              {"<"}
            </Button>
          )}
          <Button
            className={cn(css.grow)}
            onClick={() => setSeedHistory.set()}
            disabled={!iframeLoaded || lastRun === undefined}>
            {iframeLoaded ? (persistRandom ? "Preview / Randomize" : "Preview") : "Loading content"}
          </Button>
          {persistRandom && (
            <Button
              className={cn(css.grow, css.historyButton)}
              onClick={() => setSeedHistory.redo()}
              disabled={!iframeLoaded || lastRun === undefined || !setSeedHistory.canRedo}>
              {">"}
            </Button>
          )}
        </div>
        <div className={css.sep} />
        <div className={cn(css.row, css.noWrapRow)}>
          <Button
            className={css.grow}
            primary={iframeLoaded}
            onClick={handleExport}
            disabled={!iframeLoaded || lastRun === undefined}>
            {lastRun === undefined ? "Error" : iframeLoaded ? "Export" : "Loading content"}
          </Button>
        </div>
        <div className={css.sep} />
      </div>
    </aside>
  );
};

SideBar.propTypes = {
  name: PropTypes.string.isRequired,
  exports: PropTypes.shape({
    handler: PropTypes.func.isRequired,
    inputs: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  })
};
