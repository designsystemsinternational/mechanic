import { useEffect, useCallback, useRef, useMemo } from "react";
import { useImmer } from "use-immer";
import { inputsDefs } from "../../INPUTS";
import { NO_PRESET_VALUE, addPresetsAsSources } from "./presets.js";
import { resetOtherInteractive } from "./useInteractiveInputs.js";

const isEmptyObject = obj =>
  obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype;

const isSerializable = obj => isEmptyObject(obj) || !(JSON.stringify(obj) === "{}");

const copySerializable = obj => {
  if (typeof obj !== "object") {
    return obj;
  }
  let copy;
  if (Array.isArray(obj)) {
    copy = [];
    for (const o of obj) {
      if (isSerializable(o)) {
        copy.push(copySerializable(o));
      } else console.warn("Unserializable object ignored for local storage persistance.");
    }
  } else {
    copy = {};
    for (const key in obj) {
      if (isSerializable(obj[key])) {
        copy[key] = copySerializable(obj[key]);
      } else console.warn("Unserializable object ignored for local storage persistance.");
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
function useLocalStorageState(key, initialState, clean) {
  const [value, __setValue] = useImmer(() => clean(initialize(key, initialState)));
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
          __setValue(() => newValue);
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

  function remove() {
    localStorage.removeItem(key);
  }

  return [value, setValue, remove];
}

const cleanValues = (object, reference) => {
  for (let property in object) {
    if (!(property in reference) && property !== "preset") {
      delete object[property];
    }
  }
  // Add values that are missing?
  return object;
};

const useValues = (functionName, functionInputs, presets) => {
  const clean = useCallback(object => cleanValues(object, functionInputs), [functionInputs]);
  const initialValue = useMemo(() => {
    return Object.fromEntries([
      ["preset", NO_PRESET_VALUE],
      ...Object.entries(functionInputs)
        .filter(([_, input]) => input.type in inputsDefs)
        .map(([name, input]) => [name, inputsDefs[input.type].initValue(input)])
    ]);
  }, [functionInputs]);

  const [values, __setValues] = useLocalStorageState(`df_${functionName}`, initialValue, clean);

  const setValues = (name, value) => {
    __setValues(draft => {
      const sources = addPresetsAsSources(value, name, presets, functionInputs, draft);
      const sourcesAndInteractive = resetOtherInteractive(sources, functionInputs, name);
      for (let source of sourcesAndInteractive) {
        for (let prop in source) {
          draft[prop] = source[prop];
        }
      }
    });
  };
  return [values, setValues];
};

export { useValues };
