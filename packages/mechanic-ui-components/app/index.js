import React, { useState } from "react";
import { render } from "react-dom";
import { ParamInput, Button, Checkbox, Input, Radio, Select, Toggle } from "../src";

const root = document.getElementById("root");

const App = () => {
  const [vals, setVals] = useState({
    width: 300,
    content: "Hello world",
    choice: "Option 1",
    toggle: true
  });
  const handleChange = (e, name, value) => {
    setVals(vals => Object.assign({}, vals, { [name]: value }));
  };
  return (
    <div style={{ width: "300px" }}>
      <h3>ParamInput:</h3>
      <p>Integer</p>
      <ParamInput
        name={"width"}
        value={vals.width}
        options={{
          type: "integer",
          default: 300
        }}
        onChange={handleChange}
      />
      <br />
      <p>String</p>
      <ParamInput
        name={"content"}
        value={vals.content}
        options={{
          type: "string",
          default: "Hi"
        }}
        onChange={handleChange}
      />
      <br />
      <p>Choice</p>
      <ParamInput
        name={"choice"}
        value={vals.choice}
        options={{
          type: "string",
          default: "Option 1",
          choices: ["Option 1", "Option 2", "Option 3"]
        }}
        onChange={handleChange}
      />
      <br />
      <br />
      <p>Boolean</p>
      <ParamInput
        name={"toggle"}
        value={vals.toggle}
        options={{
          type: "boolean",
          default: true
        }}
        onChange={handleChange}
      />

      <h3>Base inputs:</h3>

      <p>Button</p>
      <Button>I'm a button</Button>
      <p>Select</p>
      <Select>
        <option>Option 1</option>
        <option>Option 2</option>
        <option>Option 3</option>
      </Select>
      <p>Toggle</p>
      <Toggle status={true}>On</Toggle>
      <Toggle status={false}>Off</Toggle>
      <p>Input</p>
      <Input type="text"></Input>
    </div>
  );
};
render(<App></App>, root);
