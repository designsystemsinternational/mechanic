import { useRef, useEffect } from "react";

export const useDebouncedCallback = (callback, timeout) => {
  const timerRef = useRef(null);

  const clear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  // If the component using this hook gets unmounted we
  // want to make sure to also clear any pending callback
  useEffect(() => () => clear(), []);

  return (...args) => {
    clear();

    timerRef.current = setTimeout(() => {
      callback(...args);
    }, timeout);
  };
};
