import { useState, useEffect, useCallback, useRef } from "react";
import { NO_PRESET_VALUE } from "./presets.js";

const copySerializable = obj => {
  if (typeof obj !== "object") {
    return obj;
  }
  const copy = {};
  for (const key in obj) {
    if (!(obj[key] instanceof File || obj[key] instanceof FileList)) {
      copy[key] = copySerializable(obj[key]);
    }
  }
  return copy;
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#using_json.stringify
const stringify = obj => {
  const copy = copySerializable(obj);
  return JSON.stringify(copy);
};

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
  return localStorage.setItem(key, stringify(value));
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

/**
 * useLocalStorageState hook
 * Tracks a value within localStorage and updates it
 * @param {string} key - Key of the localStorage object
 * @param {any} initialState - Default initial value
 */
function useLocalStorageState(key, initialState) {
  const [value, __setValue] = useState(() => initialize(key, initialState));
  const isUpdateFromListener = useRef(false);

  useEffect(() => {
    /**
     * We need to ensure there is no loop of
     * storage events fired. Hence we are using a ref
     * to keep track of whether setValue is from another
     * storage event
     */
    if (!isUpdateFromListener.current) {
      saveValueToLocalStorage(key, value);
    }
  }, [value]);

  const listen = useCallback(e => {
    if (e.storageArea === localStorage && e.key === key) {
      try {
        isUpdateFromListener.current = true;
        const newValue = JSON.parse(e.newValue || "null");
        if (value !== newValue) {
          __setValue(newValue);
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

  function setValue(newValue) {
    isUpdateFromListener.current = false;
    __setValue(newValue);
  }

  function remove() {
    localStorage.removeItem(key);
  }

  return [value, setValue, remove];
}

const cleanValues = (object, reference) =>
  object
    ? Object.entries(object)
        .filter(entry => entry[0] in reference || entry[0] === "preset")
        .reduce((acc, cur) => {
          acc[cur[0]] = cur[1];
          return acc;
        }, {})
    : Object.entries(reference).reduce(
        (current, input) => {
          if (input[1].default) current[input[0]] = input[1].default;
          else current[input[0]] = undefined;
          return current;
        },
        { preset: NO_PRESET_VALUE }
      );

const useValues = (name, inputs) => {
  const [allValues, setAllValues] = useLocalStorageState("function-values", {});

  const values = cleanValues(allValues[name], inputs);
  const setValues = assignFunc => {
    setAllValues(allValues => {
      const newValues = assignFunc(cleanValues(allValues[name], inputs));
      return Object.assign({}, allValues, { [name]: newValues });
    });
  };
  return [values, setValues];
};

export { useValues };
