import React from "react";
import Button from "./input/Button";
import { useHistory } from "react-router-dom";
import { upper } from "case";
import css from "./Nav.css";
import classnames from "classnames";

const Nav = ({ functions }) => {
  const history = useHistory();
  const names = Object.keys(functions);

  const changeFunction = direction => {
    const currentFunction = history.location.pathname.substring(1);
    const currentIndex = names.indexOf(currentFunction != "" ? currentFunction : names[0]);
    history.push(`/${names[(names.length + currentIndex + direction) % names.length]}`);
  };

  const previous = () => changeFunction(-1);
  const next = () => changeFunction(1);

  const routeFunction = history.location.pathname.substring(1);

  return (
    <div className={classnames(css.root, css.row)}>
      <Button onClick={previous}>←</Button>
      <span className={css.label}>{upper(routeFunction != "" ? routeFunction : names[0])}</span>
      <Button onClick={next}>→</Button>
    </div>
  );
};

export default Nav;
