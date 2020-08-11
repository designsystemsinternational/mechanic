import React from "react";
import Button from "./input/Button";
import { useHistory } from "react-router-dom";
import { capital } from "case";
import classnames from "classnames";
import css from "./Nav.css";

const Nav = ({ name, functions }) => {
  const history = useHistory();
  const names = Object.keys(functions);

  const handleOnChange = ({ target }) => {
    // console.log(value);
    history.push(target.value);
  };

  const changeFunction = direction => {
    const currentIndex = names.indexOf(name);
    history.push(`/${names[(names.length + currentIndex + direction) % names.length]}`);
  };

  const next = () => changeFunction(1);

  return (
    <div className={css.root}>
      <span className={css.funclabel}>{name}</span>
      <select className={css.navigationSelect} onChange={handleOnChange} name={name} value={name}>
        <option disabled>Select...</option>
        {names.map(name => (
          <option key={`route-${name}`}>{name}</option>
        ))}
      </select>
    </div>
  );
};

export default Nav;
