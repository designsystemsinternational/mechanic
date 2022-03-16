import { useReducer, useCallback, useRef, useEffect } from "react";
import seedrandom from "seedrandom";

// Adapted from
// https://github.com/imbhargav5/rooks/blob/master/packages/shared/useLocalstorageState.ts

function getValueFromLocalStorage(key) {
  if (typeof localStorage === "undefined") {
    return null;
  }
  const storedValue = localStorage.getItem(key) || "null";
  try {
    return JSON.parse(storedValue);
  } catch (err) {
    console.error(err);
  }
  return storedValue;
}

function saveValueToLocalStorage(key, value) {
  if (typeof localStorage === "undefined") {
    return null;
  }
  return localStorage.setItem(key, JSON.stringify(value));
}

/**
 * @param key Key of the localStorage object
 * @param initialState Default initial value
 */
function initialize(key, initialState) {
  const valueLoadedFromLocalStorage = getValueFromLocalStorage(key);
  if (valueLoadedFromLocalStorage === null) {
    return initialState;
  } else {
    return valueLoadedFromLocalStorage;
  }
}

function undoReducer(state, action) {
  const { past, current, future } = state;
  const { type, newPast, newCurrent, newFuture } = action;

  switch (type) {
    case "UNDO": {
      if (past.length === 0) return state;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        current: previous,
        future: [current, ...future]
      };
    }
    case "REDO": {
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, current],
        current: next,
        future: newFuture
      };
    }
    case "SET": {
      if (newCurrent === current) {
        return state;
      }
      return {
        past: [...past, current],
        current: newCurrent,
        future: []
      };
    }
    case "RESET": {
      return {
        past: [],
        current: newCurrent,
        future: []
      };
    }
    case "OVERRIDE": {
      return {
        past: newPast,
        current: newCurrent,
        future: newFuture
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
}

const getNewSeed = () => seedrandom(null, { pass: (_, seed) => ({ seed }) }).seed;

export function useSeedHistory(functionName) {
  const key = `--${functionName}-seed`;
  const [state, dispatch] = useReducer(
    undoReducer,
    initialize(key, {
      past: [],
      current: getNewSeed(),
      future: []
    })
  );

  const isUpdateFromListener = useRef(false);
  useEffect(() => {
    /**
     * We need to ensure there is no loop of
     * storage events fired. Hence we are using a ref
     * to keep track of whether setValue is from another
     * storage event
     */
    if (!isUpdateFromListener.current) {
      saveValueToLocalStorage(key, state);
    }
  }, [state]);

  const listen = useCallback(e => {
    if (e.storageArea === localStorage && e.key === key) {
      try {
        isUpdateFromListener.current = true;
        const newState = JSON.parse(e.newValue || "null");
        if (state !== newState) {
          dispatch({
            type: "OVERRIDE",
            newCurrent: newState.current,
            newPast: newState.past,
            newFuture: newState.future
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, []);
  // check for changes across windows
  useEffect(() => {
    window.addEventListener("storage", listen);
    return () => {
      window.removeEventListener("storage", listen);
    };
  }, []);

  function setValue(recipe) {
    isUpdateFromListener.current = false;
    __setValue(draft => {
      recipe(draft);
      clean(draft);
    });
  }

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;

  const undo = useCallback(() => {
    isUpdateFromListener.current = false;
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    isUpdateFromListener.current = false;
    dispatch({ type: "REDO" });
  }, []);

  const set = useCallback(() => {
    isUpdateFromListener.current = false;
    const newCurrent = getNewSeed();
    dispatch({ type: "SET", newCurrent });
    return newCurrent;
  }, []);

  const reset = useCallback(() => {
    isUpdateFromListener.current = false;
    const newCurrent = getNewSeed();
    dispatch({ type: "RESET", newCurrent: getNewSeed() });
    return newCurrent;
  }, []);

  return [state, { set, reset, undo, redo, canUndo, canRedo }];
}
