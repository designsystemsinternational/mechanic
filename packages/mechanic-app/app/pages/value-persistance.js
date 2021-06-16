// https://github.com/imbhargav5/rooks/blob/master/packages/shared/useLocalstorageState.ts
import { useState, useEffect, useCallback, useRef, Dispatch, SetStateAction } from "react";

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

// End

const filterUnusedValues = (object, reference) =>
  object
    ? Object.entries(object)
        .filter(entry => entry[0] in reference || entry[0] === "preset")
        .reduce((acc, cur) => {
          acc[cur[0]] = cur[1];
          return acc;
        }, {})
    : { preset: "default" };

const useValues = (name, params) => {
  const [allValues, setAllValues] = useLocalStorageState("function-values", {});

  const values = filterUnusedValues(allValues[name], params);
  const setValues = assignFunc => {
    setAllValues(allValues => {
      const newFunctionValues = filterUnusedValues(allValues[name], params);
      return Object.assign({}, allValues, { [name]: assignFunc(newFunctionValues) });
    });
  };
  return [values, setValues];
};

export { useValues };
