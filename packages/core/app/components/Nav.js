import React, { useEffect } from "react";
import Case from "case";
import { useHistory } from "react-router-dom";
import { DropdownIcon } from "@mechanic-design/ui-components";
import * as css from "./Nav.module.css";

export const Nav = ({ name, functions }) => {
  const history = useHistory();
  const functionsNames = Object.keys(functions);

  const currentFn = functions[name];
  const currentLabel = currentFn.settings.name || Case.title(name);

  useEffect(() => {
    document.title = currentLabel;
  }, [currentLabel]);

  return (
    <div className={css.root}>
      {functionsNames.length > 1 ? (
        <div className={css.selectContainer}>
          <h2 className={css.functionName}>{currentLabel}</h2>
          <select
            id="navigation-select"
            className={css.navigationSelect}
            onChange={({ target }) => history.push(`/${target.value}`)}
            name={name}
            value={name}>
            <option key="disabled" disabled>
              Select...
            </option>
            {functionsNames.map(fnName => {
              const fn = functions[fnName];
              const label = fn.settings.name || Case.title(fnName);
              return (
                <option key={`route-${fnName}`} value={fnName}>
                  {label}
                </option>
              );
            })}
          </select>
          <div className={css.navigationSelectSuffix}>
            <DropdownIcon width={20} />
          </div>
        </div>
      ) : (
        <h2 className={css.functionName}>{currentLabel}</h2>
      )}
    </div>
  );
};
