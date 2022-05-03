import React, { useRef } from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import { SideBar } from "./components/SideBar.js";
import { NotFound } from "./components/NotFound.js";
import { Nav } from "./components/Nav.js";
import Feedback from "./components/Feedback.js";

import functions from "./FUNCTIONS";

import * as css from "./App.module.css";

const Layout = ({ funcName, functions, mainRef, iframeRef }) => {
  const { settings } = functions[funcName];
  return (
    <div className={css.root}>
      {!settings.hideFeedback && (
        <Feedback href="https://forms.gle/uBTn8oVThZHVghV89">Got feedback?</Feedback>
      )}
      <SideBar name={funcName} exports={functions[funcName]} iframe={iframeRef} mainRef={mainRef}>
        {!settings.hideNavigation && <Nav name={funcName} functions={functions} />}
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
      <Switch>
        {Object.keys(functions).map((name, i) => (
          <Route
            key={`route-${name}`}
            path={[`/${name}`]}
            render={() => (
              <Layout funcName={name} functions={functions} iframeRef={iframe} mainRef={mainRef} />
            )}
          />
        ))}
        <Route
          exact
          path="/"
          render={() => (
            <Layout
              funcName={firstFunctionName}
              functions={functions}
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
