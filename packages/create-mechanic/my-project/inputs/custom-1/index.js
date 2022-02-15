import React, { useState } from "react";

export const typeName = "my-input-1";

export const properties = {
  default: {
    validation: (value) =>
      !Array.isArray(value)
        ? `Property "default" should be array, not ${typeof value}`
        : null,
  },
};
export const requiredProperties = ["default"];

const alterArray = (array, index, value) => {
  const copy = [...array];
  copy[index] = value;
  return copy;
};

const removePosition = (array, index) => {
  const copy = [...array];
  copy.splice(index, 1);
  return copy;
};

export const Input = (props) => {
  const { id, name, className, values, inputDef, onChange } = props;

  const value = values[name] ?? inputDef.default;
  const label = inputDef.label ?? name;

  const [hey, setHey] = useState(true);

  return (
    <div className={className}>
      {label && <label htmlFor={id}>{label}</label>} <br />
      {hey && (
        <div>
          {value.map((v, index) => (
            <React.Fragment key={index}>
              <input
                id={id}
                type="number"
                value={v}
                onChange={(e) =>
                  onChange(e, name, alterArray(value, index, e.target.value))
                }
              ></input>
              <button
                onClick={(e) => onChange(e, name, removePosition(value, index))}
              >
                -
              </button>
              <br />
            </React.Fragment>
          ))}
          <button onClick={(e) => onChange(e, name, [...value, 0])}>+</button>
        </div>
      )}
      <button onClick={() => setHey((h) => !h)}>
        {hey ? "CLOSE" : "OPEN"} INPUT{" "}
      </button>
    </div>
  );
};
