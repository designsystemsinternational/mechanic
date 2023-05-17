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
