import React from "react";
import Case from "case";
import { useHistory } from "react-router-dom";
import * as css from "./Nav.module.css";

export const Nav = ({ name, functionsNames }) => {
  let history = useHistory();

  return (
    <div className={css.root}>
      <label className={css.label} htmlFor="navigation-select">
        Design Functions
      </label>
      <div className={css.selectContainer}>
        <span className={css.functionLabel}>{Case.title(name)}</span>
        <select
          id="navigation-select"
          className={css.navigationSelect}
          onChange={({ target }) => history.push(target.value)}
          name={name}
          value={name}>
          <option key="disabled" disabled>
            Select...
          </option>
          {functionsNames.map(name => (
            <option key={`route-${name}`} value={name}>
              {Case.title(name)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
