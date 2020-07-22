import React, { useState } from "react";
import Select from "./input/Select";
import { useHistory } from "react-router-dom";
import css from "./Nav.css";

const Nav = ({ functions }) => {
  const names = Object.keys(functions);
  const [cur, setCur] = useState(names[0]);
  const history = useHistory();

  const handleOnChange = (e, name, value) => {
    setCur(value);
    history.push(`/${value}`);
  };

  return (
    <div className={css.root}>
      <Select onChange={handleOnChange} value={cur}>
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
