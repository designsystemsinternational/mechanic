# Mechanic App

HOW TO USE HERE!

## Running notes

Events:

- `init` when the design function runs. Needs the el and finalParams
- `frame` when the design function receives a new frame (video only). el and finalParams
- `done` when the design function is ready. Needs the el, finalParams, and mime type info?

- Image function needs to call init() (optional) and done() (so people can draw stuff in the canvas with mouse, etc)
- Video function needs to call init(), frame() and done()
