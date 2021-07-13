import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import { Controls } from "./pages/Controls";
import { NotFound } from "./pages/NotFound";
import { Nav } from "./pages/Nav";

import functions from "./FUNCTIONS";
const functionNames = Object.keys(functions);

import css from "./App.css";

const AppComponent = () => {
  return (
    <div className={css.root}>
      <Switch>
        {functionNames.map((name, i) => (
          <Route
            exact
            key={`route-${name}`}
            path={i == 0 ? ["/", `/${name}`] : `/${name}`}
            render={() => (
              <Controls name={name} exports={functions[name]}>
                <Nav name={name} functionsNames={functionNames} />
              </Controls>
            )}
          />
        ))}
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export const App = withRouter(AppComponent);
