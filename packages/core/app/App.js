import React, { useRef } from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import { SideBar } from "./components/SideBar.js";
import { NotFound } from "./components/NotFound.js";
import { Nav } from "./components/Nav.js";
import Feedback from "./components/Feedback.js";

import functions from "./FUNCTIONS";

import * as css from "./App.module.css";

const Layout = (funcName, func, mainRef, iframeRef) => {
  return (
    <div className={css.root}>
      <SideBar name={funcName} exports={func} iframe={iframe} mainRef={mainRef}>
        <Nav name={funcName} functions={functions} />
      </SideBar>
      <main className={css.main} ref={mainRef}>
        <iframe
          title={`Design function ${funcName} document.`}
          src={`/${funcName}.html`}
          className={css.iframe}
          ref={iframeRef}
        />
      </main>
    </div>
  );
};

const AppComponent = () => {
  const mainRef = useRef();
  const iframe = useRef();
  const firstFunctionName = Object.keys(functions)[0];
  return (
    <div className={css.base}>
      <Feedback href="https://forms.gle/uBTn8oVThZHVghV89">Got feedback?</Feedback>
      <Switch>
        {Object.keys(functions).map((name, i) => (
          <Route
            key={`route-${name}`}
            path={[`/${name}`]}
            render={() => (
              <Layout funcName={name} func={functions[name]} iframeRef={iframe} mainRef={mainRef} />
            )}
          />
        ))}
        <Route
          exact
          path="/"
          render={() => (
            <Layout
              funcName={firstFunctionName}
              func={functions[firstFunctionName]}
              iframeRef={iframe}
              mainRef={mainRef}
            />
          )}
        />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export const App = withRouter(AppComponent);
