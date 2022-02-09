import { basicTypes } from "./base-inputs/index.js";

const setUp = customInputs => {
  const customInputsByName = Object.fromEntries(
    Object.entries(customInputs).map(([fileName, fileExport]) => [
      fileExport.typeName ?? fileName,
      {
        ...fileExport,
        typeName: fileExport.typeName ?? fileName,
        properties: fileExport.properties ?? {},
        requiredProperties: fileExport.requiredProperties ?? [],
        validation: fileExport.validation ?? (() => null),
        prepareValue: fileExport.prepareValue ?? (v => v),
        Input: fileExport.Input,
        eventType: fileExport.eventType,
        eventHandler: fileExport.eventHandler
      }
    ])
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
      .map(([name, properties]) => [
        name,
        { type: properties.eventType, handler: properties.eventHandler }
      ])
      .filter(([name, eventObject]) => !!eventObject.type)
  );
  return [inputs, customComponents, interactiveInputs];
};

export { setUp };
