import React from "react";
import Button from "./input/Button";
import { useHistory } from "react-router-dom";
import { upper } from "case";
import classnames from "classnames";
import css from "./Nav.css";

const Nav = ({ name, functions }) => {
  const history = useHistory();
  const names = Object.keys(functions);

  const changeFunction = direction => {
    const currentIndex = names.indexOf(name);
    history.push(`/${names[(names.length + currentIndex + direction) % names.length]}`);
  };

  const previous = () => changeFunction(-1);
  const next = () => changeFunction(1);

  return (
    <div className={classnames(css.root, css.row)}>
      <Button onClick={previous}>←</Button>
      <span className={css.label}>{upper(name)}</span>
      <Button onClick={next}>→</Button>
    </div>
  );
};

export default Nav;
