# @mechanic-design/transition

Helper functions to make animation easier.

## Usage

```js
import { transition } from "@mechanic-design/transition";

export const handler = ({ inputs, frame, done, drawLoop }) => {
  const xPos = transition({
    from: 0,
    to: 100,
    // These can be frames or seconds, depending on what
    // you pass as the tick in the next step
    duration: 10,
    delay: 1,

    // Allows to set how often the transition should run
    // Defaults to 1
    iterationCount: 10,

    // Defines the direction of the animation
    // forward (0 -> 1)
    // runs the animation in the specified direction
    //
    // reverse (1 -> 0)
    // runs the animation in the reversed direction 
    //
    // alternate (0 -> 1 -> 0 -> 1 -> ...)
    // runs the animation in alternating directions, starting
    // with a forwards run.
    //
    // alternateReverse (1 -> 0 -> -> 0 -> ...)
    // runs the animation in alternating directions, starting
    // with a reversed run.
    //
    // Defaults to forward
    direction: 'alternate',

    // Sets the easing curve of the transition. Accepts a custom
    // function or a string referring to one of the predefined
    // easing curves. See `src/easings.js` for a list of all
    // predefined easings.
    //
    // Defaults to linear
    easing: 'easeInOutExpo',
  });

  drawLoop({ frameCount, timestamp }) => {
    ctx.fillRect(
      // If you pass the timestamp here, duration and delay
      // will be treated as seconds.
      //
      // If you passed frameCount, duration and delay would
      // be considered as frame offsets.
      xPos(timestamp),
      0,
      100,
      100,
    );
  });
};
```
