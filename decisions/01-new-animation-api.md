# New Animation API

## Status

Proposed

## Context

Mechanic currently has support for animations. When setting `animation: true` in a design function, it receives the `frame()` and `done()` callbacks that can be used to record individual frames into a movie file and finish the movie file all together. However, the framework doesn't come with any built-in tooling for running a draw loop inside your design function, so each template and example ships with its own helper code to facilitate this. For `engine-react`, this is a `useDrawLoop` hook that will re-render the React component 60 frames per second until the `done` callback is called. For the `engine-canvas`, we set up a `drawFrame` function that gets called with `requestAnimationFrame`.

For the `2.0` release, we want to improve this setup to create a standardized animation API that cleans up the animated design functions by moving some logic into the Mechanic core, while still giving users the flexibility to write animation with whatever mental model feels comfortable for them. Choosing a standardized animation API is a bit tricky with Mechanic, since it integrates with different kinds of frameworks and web technologies, and each of these frameworks have their own ways of doing things.

- **p5.js** has its own animation api with the `setup` and `draw` functions. So `engine-p5` will most likely just want to use the `frame` and `done` callbacks as it currently does. Furthermore, this frame-based animation style encourages the use of global variables to hold the cumulated state of the animation, which makes it harder to implement the timeline functionality described below.
- **React** does not ship with any animation API, so users can either just re-render their component once per frame (which is a bit slow) or use something like `motion` to perform animations in a more event-driven fashion (which is faster because of the `motion` `animated` components that bypass the react rendering tree; the same could manually be done by manipulating the DOM directly inside `useEffect`). Furthermore, React components are most of the time pure functions, which is a benefit for the timeline functionality mentioned below.
- `engine-svg` and `engine-canvas` have no best practices since these are just slim wrappers around the native HTML5 elements.

One important aspect of this new animation API is that we want the ability to show a timeline scrubber in the Mechanic UI to give users an easy way to preview a specific frame of their design function output. This can only be done for pure functions, where each frame is a pure result of the current frame number. This timeline functionality is not described in this decision, but will build upon any decisions made in this proposal.

We explored a new animation API where design functions default to a frame-based approach and the draw loop was hidden from the user inside mechanic core. This approach would call the design function over and over again in a pace determined by the `frameRate` setting, making it a pure function of the current frame count. This approach would make implementing a timeline in the UI very simple, as the frameCount can be passed to the design function directly. However this approach comes with drawbacks. Treating the entire design function as a pure function is very opioniated and removes a lot of flexibilty from the way mechanic can currently be used or at least makes things like loading fonts/images or generating random numbers more verbose, because they need to be persisted across function calls (as a pure function is stateless).

See [#152](https://github.com/designsystemsinternational/mechanic/pull/152) for a full discussion and demo implementation of this approach.

## Decision

We propose a new animation API that provides users with a simple and unified drawLoop. If the drawLoop is used it will automatically respect the pace determined in the `frameRate` setting and call the callback given to the draw loop until `done` is called to stop the animation.

The callback inside the draw loop receives the current frame number as its only argument. Its implementation is up to the user. A pure function is encouraged but not enforced.

In this approach the timeline could be an opt-in feature that can be enabled in the settings. If a timeline value is given mechanic-core could bypass the draw loop and just call the frame callback once with the frame number the user wants to preview. As the draw loop does not enforce a pure function, a warning and good documentation should be added that a pure drawing function is needed for the timeline to properly work. This would make the timeline more of a
power-user feature.

This approach does not impose any rules about the duration (or exit condition) of an animation. It is still up to the user to call `done` at some point in the animation lifecycle to finalize the animation.

## Implementation Details

The new animation API comes with a new setting:

- `frameRate` (default: `60`) is a number that can be used to change the number of frames per second that the design function is called.

The argument syntax is also changing slightly by placing the `frame`, `done` and the new `drawLoop` functions as root properties of the design function argument object. We are also removing the need for passing the element into these callbacks except for `engine-svg` where it is needed.

Here's a look at what this new animation API will look like for each engine.

### `engine-canvas`

```js
import engine from "@mechanic-design/engine-canvas";

export const handler = async ({ inputs, frame, done, drawLoop, getCanvas }) => {
  const canvas = getCanvas(inputs.width, inputs.height);
  const font = await doSomeHeavyFontLoading();
  drawLoop(frameCount => {
    // Drawing code
    if (frameCount >= 100) {
      done();
    } else {
      frame();
    }
  });
};

export const settings = {
  engine,
  frameRate: 24
};
```

### `engine-svg`

```js
import engine from "@mechanic-design/engine-svg";

export const handler = async ({ inputs, frame, done, drawLoop }) => {
  let someGlobalState = 0;

  // This example shows an "impure" function passed to the drawLoop
  // and will not work with the timeline functionality.
  drawLoop(_ => {
    // drawing code
    someGlobalState += 10;
    if (someGlobalState >= 100) {
      done(svgString);
    } else {
      frame(svgString);
    }
  });
};

export const settings = {
  engine
};
```

### `engine-react`

```js
import engine, { useDrawLoop } from "@mechanic-design/engine-react";

export const handler = async ({ inputs, frame, done, drawLoop }) => {
  const frameCount = useDrawLoop(drawLoop);

  useEffect(() => {
    // Potentially doing state updates here
    if (frameCount >= 100) {
      done();
    } else {
      frame();
    }
  }, [frameCount]);

  return <div></div>;
};

export const settings = {
  engine
};
```

### `engine-p5`

For `engine-p5`, no `drawLoop` is provided as `p5` comes with its own draw loop. Here we only make sure to pass any value specified for the `frameRate` to p5 before rendering the sketch.

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
  engine: require("@mechanic-design/engine-p5"),
  frameRate: 30
};
```

## Consequences

### Positive Consequences

The benefits for most users is that they will get an animation API that gets out of their way while still providing flexibility. The templates and examples for animated design functions will be a lot slimmer because there is no custom boilerplate code left in the functions. And it will provide us with an API that we can build nice things on top of.

### Negative Consequences

The main disadvantage is that since we are are not enforcing a pure functional approach, the timeline might be harder to implement or yield weird results when a drawing function is not a pure function
