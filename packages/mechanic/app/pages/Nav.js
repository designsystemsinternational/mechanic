import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import css from "./Nav.css";

export const Nav = ({ name, functionsNames }) => {
  // let history = useHistory();
  // let location = useLocation();
  let [a, setA] = useState(1);

  useEffect(() => {
    console.log("hry");
  });

  return (
    <div className={css.root}>
      <span className={css.funclabel}>{name}</span>
      <select
        className={css.navigationSelect}
        onChange={({ target }) => setA(2)}
        name={name}
        value={name}>
        <option key="disabled" disabled>
          Select...
        </option>
        {functionsNames.map(name => (
          <option key={`route-${name}`}>{name}</option>
        ))}
      </select>
    </div>
  );
};
