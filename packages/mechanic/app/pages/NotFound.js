import React from "react";
import * as css from "./NotFound.module.css";
console.log(css, css.root);
export const NotFound = props => {
  return (
    <div className={css.root}>
      <p>Not found</p>
    </div>
  );
};
