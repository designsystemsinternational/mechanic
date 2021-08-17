import React, { useState } from "react";
import { render } from "react-dom";
import {
  ParamInput,
  TextInput,
  NumberInput,
  ColorInput,
  Select,
  ImageInput,
  Button,
  Toggle
} from "../src/index.js";

import * as css from "./index.module.css";

const App = () => {
  const [values, setValues] = useState({
    text: "Hello world",
    toggle: true,
    number: 400,
    range: 400,
    slider: 400,
    colorHex: "#f62696",
    colorRgba: "rgba(200,120,34,1)",
    textOption: "Option 1",
    numberOption: 10,
    objectOption: "first",
    singleImage: null,
    multipleImages: null
  });

  const handleChange = (e, name, value) => {
    console.info(name, typeof value, value);
    setValues(values => Object.assign({}, values, { [name]: value }));
  };

  return (
    <div className={css.root}>
      <h3>ParamInput component</h3>
      <div className={css.simpleBlock}>
        <ParamInput
          name={"text"}
          values={values}
          attributes={{
            type: "text",
            label: "The Text",
            default: "Hi",
            validation: value => (value.length < 15 ? null : "Length must be less than 15")
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.simpleBlock}>
        <ParamInput
          name={"toggle"}
          values={values}
          attributes={{
            type: "boolean",
            default: true,
            validation: value => (value ? null : "Must be true")
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.simpleBlock}>
        <ParamInput
          name={"number"}
          values={values}
          attributes={{
            type: "number",
            default: 400,
            validation: value => (value < 450 || value > 455 ? null : "Not in range")
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.simpleBlock}>
        <ParamInput
          name={"range"}
          values={values}
          attributes={{
            type: "number",
            default: 400,
            min: 400,
            max: 500,
            step: 10,
            validation: value => (value < 430 || value > 465 ? null : "Not in range")
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.simpleBlock}>
        <ParamInput
          name={"slider"}
          values={values}
          attributes={{
            type: "number",
            default: 400,
            min: -500,
            max: 500,
            step: 0.5,
            slider: true,
            validation: value => (value < 430 || value > 465 ? null : "Not in range")
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.simpleBlock}>
        <ParamInput
          name={"colorHex"}
          values={values}
          attributes={{
            type: "color",
            model: "hex",
            default: "#f62696",
            validation: value => (value[1] === "f" ? null : "Should have high red channel")
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.simpleBlock}>
        <ParamInput
          name={"colorRgba"}
          values={values}
          attributes={{
            type: "color",
            model: "rgba",
            default: "rgba(200,120,34,1)"
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.simpleBlock}>
        <ParamInput
          name={"textOption"}
          values={values}
          attributes={{
            type: "text",
            default: "Option 1",
            options: ["Option 1", "Option 2", "Option 3"],
            validation: value => (value === "Option 1" ? null : "Should be Option 1")
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.simpleBlock}>
        <ParamInput
          name={"disabledTextOption"}
          values={values}
          attributes={{
            type: "text",
            editable: false,
            default: "Option 1",
            options: ["Option 1", "Option 2", "Option 3"],
            validation: value => (value === "Option 1" ? null : "Should be Option 1")
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.simpleBlock}>
        <ParamInput
          name={"numberOption"}
          values={values}
          attributes={{
            type: "number",
            default: 10,
            options: [10, 13, 30],
            validation: value => (value < 20 ? null : "Should be less than 20")
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.simpleBlock}>
        <ParamInput
          name={"objectOption"}
          values={values}
          attributes={{
            type: "text",
            default: "first",
            options: { first: {}, second: {} },
            validation: value => (value == "first" ? null : "Should be first")
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.simpleBlock}>
        <ParamInput
          name={"singleImage"}
          values={values}
          attributes={{
            type: "image",
            multiple: false,
            validation: file => file && (file.size < 50000 ? null : "Too big!")
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.simpleBlock}>
        <ParamInput
          name={"multipleImages"}
          values={values}
          attributes={{
            type: "image",
            multiple: true,
            validation: value => null
          }}
          onChange={handleChange}
        />
      </div>
      <h3>Editable ParamInput components</h3>
      <div className={css.pairBlock}>
        <ParamInput
          name={"text"}
          values={values}
          attributes={{
            type: "text",
            default: "Hi"
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.pairBlock}>
        <ParamInput
          name={"text"}
          values={values}
          attributes={{
            type: "text",
            default: "Hi",
            editable: false
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.pairBlock}>
        <ParamInput
          name={"toggle"}
          values={values}
          attributes={{
            type: "boolean",
            default: true
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.pairBlock}>
        <ParamInput
          name={"toggle"}
          values={values}
          attributes={{
            type: "boolean",
            default: true,
            editable: false
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.pairBlock}>
        <ParamInput
          name={"number"}
          values={values}
          attributes={{
            type: "number",
            default: 400
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.pairBlock}>
        <ParamInput
          name={"number"}
          values={values}
          attributes={{
            type: "number",
            default: 400,
            editable: false
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.pairBlock}>
        <ParamInput
          name={"slider"}
          values={values}
          attributes={{
            type: "number",
            default: 400,
            min: -500,
            max: 500,
            step: 0.5,
            slider: true
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.pairBlock}>
        <ParamInput
          name={"slider"}
          values={values}
          attributes={{
            type: "number",
            default: 400,
            min: -500,
            max: 500,
            step: 0.5,
            slider: true,
            editable: false
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.pairBlock}>
        <ParamInput
          name={"colorHex"}
          values={values}
          attributes={{
            type: "color",
            model: "hex",
            default: "#f62696"
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.pairBlock}>
        <ParamInput
          name={"colorHex"}
          values={values}
          attributes={{
            type: "color",
            model: "hex",
            default: "#f62696",
            editable: false
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.pairBlock}>
        <ParamInput
          name={"textOption"}
          values={values}
          attributes={{
            type: "text",
            default: "Option 1",
            options: ["Option 1", "Option 2", "Option 3"]
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.pairBlock}>
        <ParamInput
          name={"textOption"}
          values={values}
          attributes={{
            type: "text",
            default: "Option 1",
            options: ["Option 1", "Option 2", "Option 3"],
            editable: false
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.pairBlock}>
        <ParamInput
          name={"singleImage"}
          values={values}
          attributes={{
            type: "image",
            multiple: false
          }}
          onChange={handleChange}
        />
      </div>
      <div className={css.pairBlock}>
        <ParamInput
          name={"singleImage"}
          values={values}
          attributes={{
            type: "image",
            multiple: false,
            editable: false
          }}
          onChange={handleChange}
        />
      </div>
      <h3>Inputs</h3>
      <div className={css.simpleBlock}>
        <TextInput label="Text Input" placeholder="Write... "></TextInput>
      </div>
      <div className={css.simpleBlock}>
        <NumberInput label="Number Input" placeholder="Write... "></NumberInput>
      </div>
      <div className={css.simpleBlock}>
        <NumberInput
          label="Range Input"
          placeholder="Write... "
          min="100"
          max="200"
          step="5"></NumberInput>
      </div>
      <div className={css.simpleBlock}>
        <NumberInput label="Slider Number Input" slider min="100" max="200" step="5"></NumberInput>
      </div>
      <div className={css.simpleBlock}>
        <ColorInput label="Color Input" value="rgba(100, 200, 200,1)"></ColorInput>
      </div>
      <div className={css.simpleBlock}>
        <Select label="Select Input">
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </Select>
      </div>
      <div className={css.simpleBlock}>
        <ImageInput label="Image Input" />
      </div>
      <h3>Buttons</h3>
      <div className={css.simpleBlock}>
        <Button>I'm a button</Button>
      </div>
      <div className={css.simpleBlock}>
        <Toggle status={true}>Toggle On</Toggle>
      </div>
      <div className={css.simpleBlock}>
        <Toggle status={false}>Toggle Off</Toggle>
      </div>
    </div>
  );
};

const root = document.getElementById("root");
render(<App></App>, root);
