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
        prepareValue: fileExport.prepareValue ?? (v => v)
      }
    ])
  );
  const customComponents = Object.fromEntries(
    Object.entries(customInputsByName).map(([name, properties]) => [name, properties.Input])
  );
  const inputs = {
    ...customInputsByName,
    ...basicTypes
  };
  return [inputs, customComponents];
};

export { setUp };
