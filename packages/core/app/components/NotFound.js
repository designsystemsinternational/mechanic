import React from "react";
import { Link } from "react-router-dom";

import * as css from "./NotFound.module.css";

export const NotFound = ({ theresNoFunctions }) => {
  return (
    <div className={css.root}>
      {theresNoFunctions ? (
        <p>
          There's no Design Functions to show! Create a new one or un-hide some!
        </p>
      ) : (
        <p>
          URL not found! Go <Link to="/">home</Link>.
        </p>
      )}
    </div>
  );
};
