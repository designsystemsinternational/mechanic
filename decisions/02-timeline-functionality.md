# Timeline control for animated design functions

## Status

Proposed

## Context

When fine tweaking values for an animated design function developers might find
themselves in a situation where they just a need a single frame of the animation
for reference. They want to be able to update an input value or a constant in
code and judge the visual effect of this change based on a single frame.

We had this experience when using Mechanic to develop the title and credit
sequences for a movie.

Using the current setup there are ways of manually adding this behavior, but
they require developers to work with their own drawloops, add the needed input
and take care of the conditional rendering (animate vs. still frame) themselves.

This document proposes a timeline input as part of mechanic core. It is intended
as an opt-in developer feature that's most useful in purely frame based
animations. It makes heavy use of the [proposed](https://github.com/designsystemsinternational/mechanic/pull/156) new [Animation API](https://github.com/designsystemsinternational/mechanic/pull/157).

## Decision

We propose a timeline input that developers can opt into for animated design
functions. To do so they'd have to set the `showTimeline` property of their
function's settings to `true`.

By default the timeline renders with two additional number inputs for the min
frame number and the max frame number. The timeline scrubber interpolates
between these two values. This makes sure a developer can zoom in and zoom out
of the animation area they need.

Alternatively developers can hardcode the maximum number of frames for the
timeline by passing the `timelineMaxFrames` setting. If this is set, the timline
input will just show the scrubber and interpolate between `0 ` and the value of
`timelineMaxFrames`.

The timeline is a development feature only. When building your design tool for
deployment it is not exported.

## Implementation Details (optional)

The timeline can be accessed with two new settings:

- `showTimeline` is a new boolean a developer can set to true if they want the timeline input. By default this is `false`.
- `timelineMaxFrames` is an optional number settings. If set this determines the range of the scrubbable timeline. If not set the timeline renders with two number fields for setting the min and max frame in the function's UI.

```javascript
export const settings = {
  engine: require('@mechanic-design/engine-to-use'),
  animated: true,
  showTimeline: true,
  timelineMaxFrames: 100
}
```

## Consequences

### Positive Consequences

- Adding this timeline based on the new animation API frees developers from having to implement something like this themselves. This increases the speed at which ideas can be explored and tweaked.

### Negative Consequences

- Timeline behavior might be confusing in non frame-based design functions
- Setting a min and max frame on the timeline might confuse people into thinking this would set the export range of the video (like After Effects does it).
