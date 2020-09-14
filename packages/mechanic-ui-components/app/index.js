import React, { useState } from "react";
import { render } from "react-dom";
import { ParamInput, Button, Checkbox, TextInput, Radio, Select, Toggle } from "../src";

const root = document.getElementById("root");

const App = () => {
  const [vals, setVals] = useState({
    width: 400,
    height: 400,
    content: "Hello world",
    choice: "Option 1",
    toggle: true,
    color: "rgba(200, 120, 34, 1)"
  });
  const handleChange = (e, name, value) => {
    setVals(vals => Object.assign({}, vals, { [name]: value }));
  };
  return (
    <div style={{ width: "300px" }}>
      <h3>ParamInput:</h3>
      <ParamInput
        name={"height"}
        value={vals.height}
        attributes={{
          type: "number",
          default: 400
        }}
        onChange={handleChange}
      />
      <br />
      <ParamInput
        name={"width"}
        value={vals.width}
        attributes={{
          type: "number",
          default: 400,
          min: 400,
          max: 500,
          step: 10,
          slider: true
        }}
        onChange={handleChange}
      />
      <br />
      <ParamInput
        name={"content"}
        value={vals.content}
        attributes={{
          type: "string",
          default: "Hi"
        }}
        onChange={handleChange}
      />
      <br />
      <ParamInput
        name={"color"}
        value={vals.color}
        attributes={{
          type: "color",
          model: "hex",
          default: "rgba(200,120,34,1)"
        }}
        onChange={handleChange}
      />
      <br />
      <ParamInput
        name={"choice"}
        value={vals.choice}
        attributes={{
          type: "string",
          default: "Option 1",
          choices: ["Option 1", "Option 2", "Option 3"]
        }}
        onChange={handleChange}
      />
      <br />
      <ParamInput
        name={"toggle"}
        value={vals.toggle}
        attributes={{
          type: "boolean",
          default: true
        }}
        onChange={handleChange}
      />

      <h3>Base inputs:</h3>

      <span>Button</span>
      <Button>I'm a button</Button>
      <Select label="Select input: ">
        <option>Option 1</option>
        <option>Option 2</option>
        <option>Option 3</option>
      </Select>
      <span>Toggle</span>
      <Toggle status={true}>On</Toggle>
      <Toggle status={false}>Off</Toggle>
      <TextInput label="Text input: "></TextInput>
    </div>
  );
};
render(<App></App>, root);
