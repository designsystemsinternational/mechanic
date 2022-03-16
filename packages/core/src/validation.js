import { MechanicError } from "./mechanic-error.js";

const hasKey = (obj, key) => obj.hasOwnProperty(key);

/**
 * A class to run validations over Mechanic inputs and design functions
 */
export class MechanicValidator {
  /**
   * Mechanic class constructor
   * @param {object} inputDefinitions - Inputs definitions containing mechanic base and custom
   * @param {object} designFunction - Design function export object
   */
  constructor(inputDefinitions, designFunction) {
    this.inputDefs = inputDefinitions;
    this.designFunction = designFunction;
  }

  validateFunctionExports() {
    const expectedProperties = ["handler", "inputs", "settings"];
    for (const property of expectedProperties) {
      if (!(property in this.designFunction)) {
        throw new MechanicError(`Missing export definition "${property}" in design function`);
      }
    }
  }

  validateSettings() {
    const engine = this.designFunction.settings?.engine?.run;
    if (engine === undefined) {
      throw new MechanicError(`Proper engine not found in design function's setting`);
    }
  }

  validateInputs() {
    const { inputDefs } = this;
    for (let [inputName, input] of Object.entries(this.designFunction.inputs)) {
      const { type } = input;
      // Check at least the type is declared correctly
      if (type === undefined) {
        throw new MechanicError(
          `Declared input "${inputName}" does not contain a 'type' property.`
        );
      }
      if (typeof type !== "string") {
        throw new MechanicError(
          `Declared input "${inputName}"'s 'type' property should be "string", not ${typeof type}.`
        );
      }
      const typeDef = inputDefs[type];
      // Check type is supported
      if (typeDef === undefined) {
        throw new MechanicError(
          `Declared input "${inputName}" of type "${type}" does not exists. Expected either: ${Object.keys(
            inputDefs
          )}.`
        );
      }
      // Check all required properties of type are present
      const { requiredProperties } = typeDef;
      for (let property of requiredProperties) {
        if (!hasKey(input, property)) {
          throw new MechanicError(
            `Declared input "${inputName}" must have required property "${property}".`
          );
        }
      }
      // Run properties validation
      const { properties } = typeDef;
      for (let property in properties) {
        if (hasKey(input, property)) {
          const error = properties[property].validation(input[property], input);
          if (error)
            throw new MechanicError(
              `Error thrown during input "${inputName}"'s property "${property}" validation:\n${error}`
            );
        }
      }
    }
  }

  validateValues(values = {}) {
    // Run validation functions for values.
    for (let [inputName, input] of Object.entries(this.designFunction.inputs)) {
      if (hasKey(values, inputName)) {
        const { validation } = this.inputDefs[input.type];
        const error = validation(values[inputName], input);
        if (error)
          throw new MechanicError(
            `Error thrown during input "${inputName}"'s value validation:\n${error}`
          );
      }
    }

    const otherInputs = { preset: true, scaleToFit: true, randomSeed: true };

    // Check that there are not other values besides inputs and default inputs
    for (let inputName in values) {
      if (!hasKey(this.designFunction.inputs, inputName) && !hasKey(otherInputs, inputName)) {
        throw new MechanicError(`Unexpected ${inputName} value received not defined on template.`);
      }
    }
  }

  prepareValues(baseValues = {}) {
    const values = Object.assign({}, baseValues);
    // Go through inputs and set values based on baseValues
    for (let [inputName, input] of Object.entries(this.designFunction.inputs)) {
      const { prepareValue } = this.inputDefs[input.type];
      values[inputName] = prepareValue(baseValues[inputName], input);
    }

    return values;
  }
}
