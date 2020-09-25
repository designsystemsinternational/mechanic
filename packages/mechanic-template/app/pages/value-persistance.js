import createPersistedState from "use-persisted-state";
const useFunctionValues = createPersistedState("function-values");

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
  const [allValues, setAllValues] = useFunctionValues({});

  const values = filterUnusedValues(allValues[name], params);
  const setValues = assigFunc => {
    setAllValues(allValues => {
      const newFunctionValues = filterUnusedValues(allValues[name], params);
      return Object.assign({}, allValues, { [name]: assigFunc(newFunctionValues) });
    });
  };
  return [values, setValues];
};

export { useValues };
