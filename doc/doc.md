# A Mechanic Project

<img alt="Mechanic App Screenshot" src="https://raw.githubusercontent.com/designsystemsinternational/mechanic/master/doc/screenshot.png" width="600">

It has the following project structure:

```
mechanic-project
├── package.json
├── mechanic.config.js
└── functions
    ├── function1
    │   └── index.js
    ├── function2
    │   └── index.js
    ├── function3
    │   └── index.js
    ├── ...
```

The Mechanic CLI commands will use `mechanic.config.js` and all **_design functions_** defined in the `functions/` directory to launch an app ready to use.

## Design Functions 🎨

All _design functions_ are JavaScript scripts contained in individual directories inside the `functions` folder, and are expected to expose certain definitions in an `index.js` script. The name of the directory will also be the name of the function.

The `index.js` script rooted in `functions` exports each design function to the main app and shoudn't be altered.

The following are the main exports needed to define a Mechanic design function:

### `handler`

Actual function to run that would generate static or dynamic assets.
The received parameters for this function depend on the engine that renders what it produces.
Usually receives custom parameter values defined in the `params` export, and a `Mechanic` instance that allows the actual rendering to occur.

[Go to Engines and Handlers](#engines-and-handlers) for further details on how to write handlers.

### `params`

Object that defines custom parameters for the design function.
Every key is used as a name for a single parameter, and the corresponding object value describes the parameter.
From this the React app shows input controls that lets the user change the values of each parameter.

For example, the following `params` export says the corresponding design function will receive changable parameters `width`, `height` and `name`. Both `width` and `height` are numbers but only the latter has mininum and maximum values.

```javascript
export const params = {
  width: {
    type: "number",
    default: 400,
  },
  height: {
    type: "number",
    default: 300,
    min: 200,
    max: 400,
  },
  name: {
    type: "text",
    default: "John",
  },
};
```

[Go to parameters](#parameters) to check the supported types of parameters and customization options.

### `settings`

Another object that sets up the design function.
This is where the corresponding rendering engine is defined and where whether the generated assets are animated or not.

For example, the following `settings` export is for an function that generates animated assets using a [p5.js](https://p5js.org/) engine:

```javascript
export const settings = {
  engine: require("@mechanic-design/engine-p5"),
  animated: true,
};
```

[Go to settings](#settings-for-df) to check the supported types of parameters and customization options.

### (Optional) `presets`

Option object export that defines different named preseted values for the design function parameters.

#### Bigger Example

```javascript
export const handler = (params, mechanic) => {
  const { width, height, primaryColor, secondaryColor, numberOfRects } = params;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = secondaryColor;

  const margin = width / 10;
  const rectWidth = (width - margin * (numberOfRects + 1)) / numberOfRects;

  for (let index = 0; index < numberOfRects; index++) {
    ctx.fillRect(
      margin + index * (rectWidth + margin),
      margin,
      rectWidth,
      height - 2 * margin
    );
  }
  mechanic.done(canvas);
};

export const params = {
  width: {
    type: "number",
    default: 400,
    validation: (v) => (v < 410 || v > 420 ? null : "Out of range"),
  },
  height: {
    type: "number",
    default: 300,
  },
  primaryColor: {
    type: "color",
    model: "hex",
    default: "#FF0000",
  },
  secondaryColor: {
    type: "color",
    options: ["#00FFFF", "#FF00FF", "#FFFF00"],
    default: "#00FFFF",
  },
  numberOfRects: {
    type: "number",
    default: 2,
    options: [2, 3, 4],
  },
};

export const presets = {
  medium: {
    width: 800,
    height: 600,
  },
  large: {
    width: 1600,
    height: 1200,
  },
  xlarge: {
    width: 3200,
    height: 2400,
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-canvas"),
};
```

### Engines and Handlers

...

### Parameters

...

### Settings for df

...
