import React, { useState, useEffect } from "react";
import css from "./Function.css";

const Function = ({ children }) => {
  return (
    <div className={css.root}>
      <aside>{children}</aside>
    </div>
  );
};

export default Function;
