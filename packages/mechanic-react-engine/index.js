import _extends from "@babel/runtime/helpers/extends";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

(function () {
  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;
  enterModule && enterModule(module);
})();

var __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default.signature : function (a) {
  return a;
};

import React, { Component } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Mechanic } from "mechanic-utils";
var root = document.getElementById("root");

var run = function run(functionName, func, values, isPreview) {
  unmountComponentAtNode(root);
  var mechanic = new Mechanic(func.params, func.settings, values);
  var Handler = func.handler;

  var onFrame = function onFrame() {
    if (!isPreview) {
      mechanic.frame(root.childNodes[0]);
    }
  };

  var onDone = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (isPreview) {
                _context.next = 4;
                break;
              }

              _context.next = 3;
              return mechanic.done(root.childNodes[0]);

            case 3:
              mechanic.download(functionName);

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function onDone() {
      return _ref.apply(this, arguments);
    };
  }();

  render( /*#__PURE__*/React.createElement(Handler, _extends({}, mechanic.values, {
    frame: onFrame,
    done: onDone
  })), root);
};

var _default = run;
export default _default;
;

(function () {
  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(root, "root", "/Users/fdoflorenzano/Projects/DSI/mechanic/packages/mechanic-react-engine/src/index.js");
  reactHotLoader.register(run, "run", "/Users/fdoflorenzano/Projects/DSI/mechanic/packages/mechanic-react-engine/src/index.js");
  reactHotLoader.register(_default, "default", "/Users/fdoflorenzano/Projects/DSI/mechanic/packages/mechanic-react-engine/src/index.js");
})();

;

(function () {
  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;
  leaveModule && leaveModule(module);
})();
