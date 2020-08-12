import React from "react";
import { useHistory } from "react-router-dom";
import css from "./Nav.css";

const Nav = ({ name, functions }) => {
  const history = useHistory();
  const names = Object.keys(functions);

  return (
    <div className={css.root}>
      <span className={css.funclabel}>{name}</span>
      <select
        className={css.navigationSelect}
        onChange={({ target }) => history.push(target.value)}
        name={name}
        value={name}>
        <option key="disabled" disabled>
          Select...
        </option>
        {names.map(name => (
          <option key={`route-${name}`}>{name}</option>
        ))}
      </select>
    </div>
  );
};

export default Nav;
