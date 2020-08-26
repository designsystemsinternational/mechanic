import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { extractContexts } from "mechanic-utils";

import Function from "./pages/Function";
import NotFound from "./pages/NotFound";
import Nav from "./components/Nav";

const functionContext = require.context("../functions", true, /^(.{2,})\/index\.js$/);
const { functions } = extractContexts(functionContext);
const functionNames = Object.keys(functions);

import css from "./App.css";

const App = props => {
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

export default withRouter(App);
