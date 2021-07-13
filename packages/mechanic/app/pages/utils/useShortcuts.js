import { useEffect } from "react";
import Mousetrap from "mousetrap";

const useGlobalShortcut = function (command, handler, iframeRef, overrideDefault = false) {
  const handlerFunction = () => {
    handler();
    return !overrideDefault;
  };
  useEffect(() => {
    Mousetrap.bind(command, handlerFunction);
    const mousetrapIframe = Mousetrap(iframeRef.current.contentWindow);
    mousetrapIframe.bind(command, handlerFunction);
    return () => {
      Mousetrap.unbind(command);
      mousetrapIframe.unbind(command);
    };
  });
};

const useShortcut = function (element, command, handler, overrideDefault = false) {
  const handlerFunction = () => {
    handler();
    return !overrideDefault;
  };
  useEffect(() => {
    const mousetrap = Mousetrap(element);
    mousetrap.bind(command, handlerFunction);
    return () => {
      mousetrap.unbind(command);
    };
  });
};

const enablesShortcutsClass = "mousetrap";

export { useGlobalShortcut, useShortcut, enablesShortcutsClass };
