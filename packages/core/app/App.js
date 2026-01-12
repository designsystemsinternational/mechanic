import React, { useRef } from "react";
import { Routes, Route } from "react-router";

import { SideBar } from "./components/SideBar.js";
import { NotFound } from "./components/NotFound.js";
import { Nav } from "./components/Nav.js";
import Feedback from "./components/Feedback.js";

import functions from "./FUNCTIONS";
const theresNoFunctions = Object.keys(functions).length === 0;

import * as css from "./App.module.css";

const Layout = ({ funcName, functions, mainRef, iframeRef }) => {
  const { settings } = functions[funcName];
  return (
    <div className={css.root}>
      {!settings.hideFeedback && (
        <Feedback href="https://forms.gle/uBTn8oVThZHVghV89">
          Got feedback?
        </Feedback>
      )}
      <SideBar
        name={funcName}
        exports={functions[funcName]}
        iframe={iframeRef}
        mainRef={mainRef}
      >
        {!settings.hideNavigation && (
          <Nav name={funcName} functions={functions} />
        )}
      </SideBar>
      <main className={css.main} ref={mainRef}>
        <iframe
          title={`Design function ${funcName} document.`}
          src={`${BASENAME}${funcName}.html`}
          className={css.iframe}
          ref={iframeRef}
        />
      </main>
    </div>
  );
};

export const App = () => {
  const mainRef = useRef();
  const iframe = useRef();
  const firstFunctionName = Object.keys(functions)[0];
  return (
    <div className={css.base}>
      <Routes>
        {Object.keys(functions).map((name) => (
          <Route
            key={`route-${name}`}
            path={`/${name}`}
            element={<Layout
              key={`layout-${name}`}
              funcName={name}
              functions={functions}
              iframeRef={iframe}
              mainRef={mainRef}
            />
            }
          />
        ))}

        <Route
          exact
          path="/"
          element={() =>
            !theresNoFunctions ? (
              <Layout
                funcName={firstFunctionName}
                functions={functions}
                iframeRef={iframe}
                mainRef={mainRef}
              />
            ) : (
              <NotFound theresNoFunctions={theresNoFunctions} />
            )
          }
        />

        <Route element={NotFound} />
      </Routes>
    </div>
  );
};
