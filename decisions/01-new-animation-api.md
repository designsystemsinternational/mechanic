# Title

## Status

Proposed

## Context

Mechanic currently has support for animations. When setting `animation: true` in a design function, it receives the `frame()` and `done` callbacks that can be used to record individual frames into a movie file and finish the movie file all together. However, the framework doesn't come with any built-in tooling for running a draw loop inside your design function, so each template and example ships with its own helper code to facilitate this. For `engine-react`, this is a `useDrawLoop` hook that will re-render the React component 60 frames per second until the `done` callback is called. For the `engine-canvas`, we set up a `drawFrame` function that gets called with `requestAnimationFrame`.

For the `2.0` release, we want to improve this setup to create a standardized animation API that cleans up the animated design functions by moving some logic into the Mechanic core, while also giving users the ability to write their own animation code if they choose so. Choosing a standardized animation API is a bit tricky with Mechanic, since it integrates with different kinds of frameworks and web technologies, and each of these frameworks have their own ways of doing things.

- **p5.js** has its own animation api with the `setup` and `draw` functions. So `engine-p5` will most likely just want to use the `frame` and `done` callbacks as it currently does. Furthermore, this frame-based animation style encourages the use of global variables to hold the cumulated state of the animation.
- **React** does not ship with any animation API, so users can either just re-render their component once per frame (which is a bit slow) or use something like `react-spring` to perform animations in a more event-driven fashion (which is faster because of the `react-spring` `animated` components that bypass the react rendering tree). Furthermore, React components are most of the time pure functions, which is a benefit for the timeline functionality mentioned below.
- `engine-svg` and `engine-canvas` have no best practices since these are just slim wrappers around the HTML5 elements.

One important aspect of this new animation API is that we want the ability to show a timeline scrubber in the Mechanic UI to give users an easy way to preview a specific frame of their design function output. This is much easier for frameworks that encourage functional design functions such as React and harder for frameworks such as p5.js. This timeline functionality is not described in this decision, but will build upon any decisions made in this proposal.

## Decision

We propose a new animation API where design functions default to a frame-based approach. If a design function is animated, it will automatically get called continously in a pace determined by the `frameRate` setting, until it calls the `done` function to stop the animation. This means that design functions are expected to be pure functions and not rely on global state to render the given frame. This in turn makes it possible for the Mechanic UI to provide a timeline that will update the design function with the given `frameCount` and result in a preview for that specific frame. Note that this new animation API does not impose any rules about the duration of the animation. This is always controlled by calling `done` at some point during the animation lifecycle.

## Implementation Details

The new animation API comes with a few changes to the settings:

- The `animated` setting is renamed to `mode` (default: `static`) and the options are `static` (for static images), `animation` (for the new animation API) and `customAnimation` (for a user to implement their own animation code using the `frame` and `done` callbacks).
- `frameRate` (default: `60`) is a number that can be used to change the number of frames per second that the design function is called in `animation` mode.

Since the new animation API encourages pure functions, the engines now ship with a `memo` function that can be used to cache things across function calls. Engine-specific helpers such as a `useCanvas` function will also be rewritten to create the canvas element on the first call and return it on following calls.

The argument syntax is also changing slightly by placing the `frame` and `done` functions as root properties of the design function argument object. The `frame` function will only get passed to the design function in `customAnimation` mode.

Here's a look at what this new animation API will look like for each engine.

### `engine-canvas`

```js
export const handler = async ({ inputs, frameCount, done, useCanvas }) => {
  const canvas = useCanvas(inputs.width, inputs.height);
  if (frameCount >= 100) {
    done(canvas);
  }
  // drawing code
  return canvas;
};

export const settings = {
  engine: require('@mechanic-design/engine-canvas'),
  mode: 'animation'
};
```

```js
export const handler = async ({ inputs, frame, done, useCanvas }) => {
  const canvas = useCanvas(inputs.width, inputs.height);
  let frameCount = 0;
  const myDrawLoop = () => {
    frameCount++;
    // drawing code
    if (frameCount >= 100) {
      done(canvas);
    } else {
      frame(canvas);
      window.requestAnimationFrame(myDrawLoop);
    }
  };
  myDrawLoop();
};

export const settings = {
  engine: require('@mechanic-design/engine-canvas'),
  mode: 'customAnimation'
};
```

### `engine-svg`

```js
export const handler = async ({ inputs, frameCount, done }) => {
  // drawing code
  if (frameCount >= 100) {
    done(svgString);
  }
  return svgString;
};

export const settings = {
  engine: require('@mechanic-design/engine-svg'),
  mode: 'animation'
};
```

```js
export const handler = async ({ inputs, frame, done }) => {
  let frameCount = 0;
  const myDrawLoop = () => {
    frameCount++;
    // drawing code
    if (frameCount >= 100) {
      done(svgString);
    } else {
      frame(svgString);
      window.requestAnimationFrame(myDrawLoop);
    }
  };
  myDrawLoop();
};

export const settings = {
  engine: require('@mechanic-design/engine-svg'),
  mode: 'customAnimation'
};
```

### `engine-react`

```js
export const handler = async ({ inputs, done, frameCount }) => {
  if (frameCount >= 100) {
    done();
  }
  return <div></div>;
};

export const settings = {
  engine: require('@mechanic-design/engine-react'),
  mode: 'animation'
};
```

The example above re-renders the component for every frame. If a user wants to use something like `react-spring` to speed up animation while keeping the frame-based approach, it could be done like this:

```js
export const handler = async ({ inputs, done, frameCount }) => {
  const spring = useSpring({ frameCount });

  if (frameCount >= 100) {
    done();
  }
  return <MyMemoedComponent spring={spring} />;
};

const MyMemoedComponent = React.memo(({ spring }) => {
  return <animated.div></animated.div>;
});

export const settings = {
  engine: require('@mechanic-design/engine-react'),
  mode: 'animation'
};
```

```js
export const handler = async ({ inputs, frame, done }) => {
  const frameCount = myOwnDrawLoopHook();
  useEffect(() => {
    if (frameCount < 100) {
      frame();
    } else {
      done();
    }
  }, [frameCount]);
  return <div></div>;
};

export const settings = {
  engine: require('@mechanic-design/engine-react'),
  mode: 'customAnimation'
};
```

### `engine-p5`

For `engine-p5`, `mode` can only be set to `static` or `customAnimation`. Or perhaps we default both `animation` and `customAnimation` to the code below?

```js
export const handler = async ({ inputs, sketch, frame, done }) => {
  sketch.setup = () => {
    // do stuff
  };
  sketch.draw = () => {
    // drawing code
    if (sketch.frameCount < 100) {
      frame();
    } else {
      done();
    }
  };
};

export const settings = {
  engine: require('@mechanic-design/engine-p5'),
  mode: 'animation'
};
```

## Consequences

### Positive Consequences

The benefits for most users is that they will get an animation API that gets out of their way. The templates and examples for animated design functions will be a lot slimmer, and it will provide us with an API that we can build nice things on top of.

### Negative Consequences

The main disadvantage I can see is:

- Users who are not comfortable writing pure functions are now defaulted into this, and if they opt out, they need to write their own animation code.
