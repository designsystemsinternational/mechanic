import { useEffect } from "react";
import Mousetrap from "mousetrap";

export const useGlobalShortcut = function (command, handler, iframRef, overrideDefault = false) {
  const handlerFunction = () => {
    handler();
    return !overrideDefault;
  };
  useEffect(() => {
    Mousetrap.bind(command, handlerFunction);
    const mousetrapIframe = Mousetrap(iframRef.current.contentWindow);
    mousetrapIframe.bind(command, handlerFunction);
    return () => {
      Mousetrap.unbind(command);
      mousetrapIframe.unbind(command);
    };
  });
};

export const useShortcut = function (element, command, handler, overrideDefault = false) {
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

export const enablesShortcutsClass = "mousetrap";
