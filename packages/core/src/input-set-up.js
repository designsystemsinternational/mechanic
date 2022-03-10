import { basicTypes } from "./base-inputs/index.js";
import { MechanicInputError } from "./mechanic-error.js";

const inputProperties = [
  "typeName",
  "properties",
  "requiredProperties",
  "Input",
  "validation",
  "prepareValue",
  "initValue",
  "eventHandlers"
];

const exportDefault = (fileName, property) => {
  switch (property) {
    case "typeName":
      return fileName;
    case "properties":
      return {};
    case "requiredProperties":
      return [];
    case "Input":
      return () => null;
    case "validation":
      return () => null;
    case "prepareValue":
      return v => v;
    case "initValue":
      return () => undefined;
    case "eventHandlers":
      return {};
    default:
      return undefined;
  }
};

const validateExportProperty = (fileName, property, exported) => {
  switch (property) {
    case "typeName":
      if (typeof exported !== "string")
        return new MechanicInputError(
          ` "${property}" export in ${fileName}/ should be of type 'string'. Got ${typeof exported}.`
        );
      break;
    case "Input":
      if (typeof exported !== "function") {
        return new MechanicInputError(
          ` "${property}" export in ${fileName}/ should be of type function. Got ${typeof exported}.`
        );
      }
      break;
    case "validation":
      if (typeof exported !== "function")
        return new MechanicInputError(
          ` "${property}" export in ${fileName}/ should be function. Got ${typeof exported}.`
        );
      break;
    case "prepareValue":
      if (typeof exported !== "function")
        return new MechanicInputError(
          ` "${property}" export in ${fileName}/ should be function. Got ${typeof exported}.`
        );
      break;
    case "initValue":
      if (typeof exported !== "function")
        return new MechanicInputError(
          ` "${property}" export in ${fileName}/ should be function. Got ${typeof exported}.`
        );
      break;
    case "properties":
      if (typeof exported !== "object")
        return new MechanicInputError(
          ` "${property}" export in ${fileName}/ should be an object. Got ${typeof exported}.`
        );
      else {
        for (let key in exported) {
          if (typeof exported[key] !== "object") {
            return new MechanicInputError(
              ` "${property}" export in ${fileName}/ should be an object that contains objects as values. Got ${typeof exported[
                key
              ]}.`
            );
          } else if (!("validation" in exported[key])) {
            return new MechanicInputError(
              ` "${property}" export in ${fileName}/ should be an object that contains 'validation' key. Key not found.`
            );
          } else if (typeof exported[key].validation !== "function") {
            return new MechanicInputError(
              ` "${property}" export in ${fileName}/ should be an object that contains function value for 'validation' key. Got: ${typeof exported.validation}.`
            );
          }
        }
      }
      break;
    case "requiredProperties":
      if (!Array.isArray(exported))
        return new MechanicInputError(
          ` "${property}" export in ${fileName}/ should be an array. Got ${typeof exported}.`
        );
      else {
        for (let item of exported) {
          if (typeof item !== "string") {
            return new MechanicInputError(
              ` "${property}" export in ${fileName}/ should be an array that contains string values. Got ${typeof item}.`
            );
          }
        }
      }
      break;
    case "eventHandlers":
      if (typeof exported !== "object")
        return new MechanicInputError(
          ` "${property}" export in ${fileName}/ should be an object. Got ${typeof exported}.`
        );
      else {
        for (let key in exported) {
          if (typeof exported[key] !== "function") {
            return new MechanicInputError(
              ` ${property} export in ${fileName}/ should be an object that contains functions as values. Got ${typeof exported[
                key
              ]}.`
            );
          }
        }
      }
      break;
    default:
      return;
  }
};

const setUp = customInputs => {
  const errors = [];
  const customInputsByName = Object.fromEntries(
    Object.entries(customInputs).map(([fileName, fileExport]) => {
      const input = inputProperties.reduce((acc, prop) => {
        const exp = fileExport[prop];
        const error = exp === undefined ? undefined : validateExportProperty(fileName, prop, exp);
        if (error) errors.push(error);
        return { ...acc, [prop]: error || exp === undefined ? exportDefault(fileName, prop) : exp };
      }, {});
      return [input.typeName, input];
    })
  );
  const customComponents = Object.fromEntries(
    Object.entries(customInputsByName)
      .map(([name, properties]) => [name, properties.Input])
      .filter(([name, Component]) => !!Component)
  );
  const inputs = {
    ...customInputsByName,
    ...basicTypes
  };
  const interactiveInputs = Object.fromEntries(
    Object.entries(inputs)
      .map(([name, properties]) => [name, properties.eventHandlers])
      .filter(([_, eventObject]) => !!eventObject && Object.keys(eventObject).length > 0)
  );
  return [inputs, customComponents, interactiveInputs, errors];
};

export { setUp };
