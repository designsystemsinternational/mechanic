import React, { useEffect } from "react";
import Mousetrap from "mousetrap";

const shortcut = function (command, handler, iframRef, overrideDefault = true) {
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

export default shortcut;
