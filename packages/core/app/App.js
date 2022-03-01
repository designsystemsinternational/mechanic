import React, { useRef } from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import { SideBar } from "./components/SideBar.js";
import { NotFound } from "./components/NotFound.js";
import { Nav } from "./components/Nav.js";
import Feedback from "./components/Feedback.js";

import functions from "./FUNCTIONS";

import * as css from "./App.module.css";

const AppComponent = () => {
  const mainRef = useRef();
  const iframe = useRef();
  return (
    <div className={css.base}>
      <Feedback href="https://forms.gle/uBTn8oVThZHVghV89">Got feedback?</Feedback>
      <Switch>
        {Object.keys(functions).map((name, i) => (
          <Route
            exact
            key={`route-${name}`}
            path={i == 0 ? ["/", `/${name}`] : `/${name}`}
            render={() => (
              <div className={css.root}>
                <SideBar name={name} exports={functions[name]} iframe={iframe} mainRef={mainRef}>
                  <Nav name={name} functions={functions} />
                </SideBar>
                <main className={css.main} ref={mainRef}>
                  <iframe
                    title={`Design function ${name} document.`}
                    src={`${name}.html`}
                    className={css.iframe}
                    ref={iframe}
                  />
                </main>
              </div>
            )}
          />
        ))}
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export const App = withRouter(AppComponent);
