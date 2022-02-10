import { useEffect } from "react";
import Mousetrap from "mousetrap";

const useShortcuts = handleExport => {
  useEffect(() => {
    Mousetrap.bind("command+e", handleExport);
    return () => {
      Mousetrap.unbind("command+e");
    };
  });
};

export { useShortcuts };
