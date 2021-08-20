import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import { Function } from "./pages/Function.js";
import { NotFound } from "./pages/NotFound.js";
import { Nav } from "./pages/Nav.js";

import functions from "./FUNCTIONS";
const functionNames = Object.keys(functions);

import * as css from "./App.module.css";

const AppComponent = () => {
  console.log("rerender");
  return (
    <div className={css.root}>
      <Switch>
        {functionNames.map((name, i) => (
          <Route
            exact
            key={`route-${name}`}
            path={i == 0 ? ["/", `/${name}`] : `/${name}`}
            render={() => (
              <Function name={name} exports={functions[name]}>
                <Nav name={name} functionsNames={functionNames} />
              </Function>
            )}
          />
        ))}
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export const App = withRouter(AppComponent);
