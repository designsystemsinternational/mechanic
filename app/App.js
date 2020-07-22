import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { requireFunctions } from "./utils";

import Function from "./pages/Function";
import NotFound from "./pages/NotFound";
const functions = requireFunctions();
const functionNames = Object.keys(functions);

import css from "./App.css";

const App = props => {
  return (
    <div className={css.root}>
      <Switch>
        {functionNames.map((name, i) => (
          <Route
            exact
            key={name}
            path={i == 0 ? ["/", `/${name}`] : `/${name}`}
            render={() => <Function name={name} exports={functions[name]} />}
          />
        ))}
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default withRouter(App);
