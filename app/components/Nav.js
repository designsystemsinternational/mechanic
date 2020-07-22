import React from "react";
import Select from "./input/Select";
import { useHistory } from "react-router-dom";
import css from "./Nav.css";

const Nav = ({ functions }) => {
  const history = useHistory();
  const names = Object.keys(functions);

  const handleOnChange = (e, name, value) => {
    history.push(`/${value}`);
  };

  return (
    <div className={css.root}>
      <Select
        onChange={handleOnChange}
        value={history.location.pathname.substring(1)}>
        {names.map(name => (
          <option key={`option-${name}`} value={name}>
            {name}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default Nav;
