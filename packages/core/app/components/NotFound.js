import React from "react";
import { Link } from "react-router-dom";

import * as css from "./NotFound.module.css";

export const NotFound = () => {
  return (
    <div className={css.root}>
      <p>
        URL not found! Go <Link to="/">home</Link>.
      </p>
    </div>
  );
};
