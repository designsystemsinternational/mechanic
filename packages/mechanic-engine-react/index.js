import _extends from "@babel/runtime/helpers/extends";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { Mechanic } from "@designsystemsinternational/mechanic-utils";
var root = document.getElementById("root");
export var run = function run(functionName, func, values, isPreview) {
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
  return mechanic;
};
