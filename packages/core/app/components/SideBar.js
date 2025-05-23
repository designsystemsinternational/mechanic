import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import { useIframeLoaded } from "./utils/useIframeLoaded.js";
import { useValues } from "./utils/useValues.js";
import { useDebouncedCallback } from "./utils/useDebouncedCallback.js";
import { getPossiblePresets, NO_PRESET_VALUE } from "./utils/presets.js";
import { useShortcuts } from "./utils/useShortcuts.js";
import { useSeedHistory } from "./utils/useSeedHistory.js";

import { Button, Toggle } from "@mechanic-design/ui-components";
import { Input } from "./Input.js";
import { useInteractiveInputs } from "./utils/useInteractiveInputs.js";

import { appComponents } from "../APP";

const AsideComponent = appComponents.SideBar
  ? appComponents.SideBar
  : ({ children }) => <aside className={css.root}>{children}</aside>;

import * as css from "./SideBar.module.css";

const DEFAULT_PREVIEW_DEBOUNCE_TIMEOUT = 100;

export const SideBar = ({
  name,
  exports: functionExports,
  iframe,
  mainRef,
  children
}) => {
  const {
    inputs,
    presets: exportedPresets,
    ExtraUi,
    settings: {
      persistRandomOnExport,
      showStateExport,
      hidePresets,
      hideScaleToFit,
      initialScaleToFit,
      hideAutoRefresh,
      initialAutoRefresh,
      hideGenerate,
      showMultipleExports,
      debounceInputs = true,
      debounceDelay
    }
  } = functionExports;
  const presets = getPossiblePresets(exportedPresets ?? {});
  const canScale = !!(inputs.width && inputs.height);
  const persistRandom =
    persistRandomOnExport === undefined || persistRandomOnExport;

  const [scaleToFit, setScaleToFit] = useState(initialScaleToFit ?? true);
  const [autoRefreshOn, setAutoRefreshOn] = useState(
    initialAutoRefresh ?? true
  );
  const [lastRun, setLastRun] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [seedHistory, setSeedHistory] = useSeedHistory(name);

  const iframeLoaded = useIframeLoaded(iframe, name);

  const [values, setValues] = useValues(name, inputs, exportedPresets);
  const handleOnChange = (e, name, value) => setValues(name, value);

  const getRunConfig = (lastRun, isPreview, random, scale, exportType) => ({
    isPreview,
    lastRun,
    boundingClient: mainRef.current.getBoundingClientRect(),
    scale: scale && canScale && scaleToFit,
    randomSeed: random,
    exportType: exportType,
    eventListeners: {
      startDownload: () => {
        setIsExporting(false);
      }
    }
  });

  const previewHandler = async () => {
    const run = iframe.current.contentWindow?.run;
    setLastRun(lastRun =>
      run
        ? run(
            name,
            values,
            getRunConfig(lastRun, true, seedHistory.current, true)
          )
        : null
    );
  };

  const preview = debounceInputs
    ? useDebouncedCallback(
        previewHandler,
        debounceDelay || DEFAULT_PREVIEW_DEBOUNCE_TIMEOUT
      )
    : previewHandler;

  const handleExport = async type => {
    const run = iframe.current.contentWindow?.run;
    setIsExporting(true);
    setLastRun(lastRun =>
      run
        ? run(
            name,
            values,
            getRunConfig(lastRun, false, seedHistory.current, false, type)
          )
        : null
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
    <AsideComponent>
      <div className={css.section}>{children}</div>
      <div className={css.sep} />

      <div className={cn(css.edge, css.top)} />
      <div className={css.inputs}>
        {!hidePresets && (
          <Input
            className={css.input}
            key="input-preset"
            name="preset"
            values={values}
            inputDef={{
              type: "text",
              options: presets,
              default: NO_PRESET_VALUE
            }}
            onChange={handleOnChange}
          />
        )}
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
        {ExtraUi && <ExtraUi values={values} onChange={handleOnChange} />}

        {!hideScaleToFit && (
          <div className={css.row}>
            <Toggle
              status={canScale && scaleToFit}
              disabled={!canScale || lastRun === undefined}
              onClick={() => setScaleToFit(scaleToFit => !scaleToFit)}
            >
              Scale to Fit
            </Toggle>
            {!canScale && (
              <span className={css.error}>Inputs missing for scaling</span>
            )}
          </div>
        )}

        {!hideAutoRefresh && (
          <>
            <div className={css.sep} />
            <div className={css.row}>
              <Toggle
                className={css.grow}
                status={autoRefreshOn}
                onClick={() =>
                  setAutoRefreshOn(autoRefreshOn => !autoRefreshOn)
                }
                disabled={!iframeLoaded || lastRun === undefined}
              >
                Auto-refresh
              </Toggle>
            </div>
          </>
        )}

        {!hideGenerate && (
          <>
            <div className={css.sep} />
            <div
              className={cn(css.row, css.noWrapRow, {
                [css.withUndo]: persistRandom
              })}
            >
              {persistRandom && (
                <Button
                  className={cn(css.grow, css.undo)}
                  onClick={() => setSeedHistory.undo()}
                  disabled={
                    !iframeLoaded ||
                    !setSeedHistory.canUndo ||
                    lastRun === undefined
                  }
                >
                  {"<"}
                </Button>
              )}
              <Button
                className={cn(css.grow)}
                onClick={() => setSeedHistory.set()}
                disabled={!iframeLoaded || lastRun === undefined || isExporting}
              >
                {iframeLoaded ? "Generate" : "Loading content"}
              </Button>
              {persistRandom && (
                <Button
                  className={cn(css.grow, css.redo)}
                  onClick={() => setSeedHistory.redo()}
                  disabled={
                    !iframeLoaded ||
                    lastRun === undefined ||
                    !setSeedHistory.canRedo
                  }
                >
                  {">"}
                </Button>
              )}
            </div>
          </>
        )}

        <div className={css.sep} />
        {!showMultipleExports ? (
          <div className={cn(css.row, css.noWrapRow)}>
            <Button
              className={css.grow}
              primary={iframeLoaded}
              onClick={() => handleExport()}
              disabled={!iframeLoaded || lastRun === undefined || isExporting}
            >
              {lastRun === undefined
                ? "Error"
                : iframeLoaded
                ? isExporting
                  ? "Exporting"
                  : "Export"
                : "Loading content"}
            </Button>
          </div>
        ) : (
          <>
            <Button
              className={css.grow}
              primary={iframeLoaded}
              onClick={() => handleExport("svg")}
              disabled={!iframeLoaded || lastRun === undefined || isExporting}
            >
              {lastRun === undefined
                ? "Error"
                : iframeLoaded
                ? isExporting
                  ? "Exporting"
                  : "Export SVG"
                : "Loading content"}
            </Button>
            <div className={css.sep} />
            <Button
              className={css.grow}
              primary={iframeLoaded}
              onClick={() => handleExport("png")}
              disabled={!iframeLoaded || lastRun === undefined || isExporting}
            >
              {lastRun === undefined
                ? "Error"
                : iframeLoaded
                ? isExporting
                  ? "Exporting"
                  : "Export PNG"
                : "Loading content"}
            </Button>
          </>
        )}

        <div className={css.sep} />
      </div>
    </AsideComponent>
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
