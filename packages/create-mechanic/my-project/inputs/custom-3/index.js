import React, { useState } from "react";

export const eventType = "mousedown";

export const eventHandler = (event) => {
  return { x: event.clientX, y: event.clientY };
};

export const Input = ({ name, values, onChange }) => {
  const value = values[name];
  return (
    <div>
      {name}: {value.x}, {value.y}
      <input
        type="number"
        value={value.x}
        onChange={(e) =>
          onChange(e, name, { ...value, x: parseFloat(e.target.value) })
        }
      ></input>
      <input
        type="number"
        value={value.y}
        onChange={(e) =>
          onChange(e, name, { ...value, y: parseFloat(e.target.value) })
        }
      ></input>
    </div>
  );
};
