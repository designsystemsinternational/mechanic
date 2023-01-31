import { MechanicError } from "./mechanic-error.js";

// Keeps a global reference to the draw loop so we don't accidentally create
// multiple loops.
let instance = null;

class MechanicDrawloop {
  /**
   * Drawloop constructor. The drawloop is realized as a singleton. Making sure
   * there is only one instance of the drawloop is needed so we can easily clear
   * any pending animation frames. This can be assured as in the current set up
   * a rerender of a design function will create a new instance of the global
   * Mechanic object. Within this class we can then access the drawloop's
   * singleton and perliminarily call stop on it, clearing any pending requested
   * aniamtion frames that are still scheduled in the browser from a previous
   * run.
   */
  constructor() {
    if (instance)
      throw new MechanicError(
        "Tried to create a second instance of the drawlop. There should only ever be one drawloop. Make sure to access the drawloop via the `drawLoop` property on the Mechanic instance."
      );
    instance = this;
  }

  /**
   * Prepare the drawloop with a frameRate
   * @param {number} frameRate - The frameRate to use for the drawloop
   */
  prepare(frameRate) {
    this.fpsInterval = 1000 / frameRate;
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.callback = null;

    return this;
  }

  /**
   * Start the drawloop. If a frame number is passed in as the second argument
   * that drawloop only renders that frame. If no frame number is passed in
   * the drawloop renders all frames in the pace determined by frameRate.
   *
   * @param {Function} cb  - The callback function to call on each frame
   * @param {number} frame - Optional frame number to render
   */
  start(cb, frame = null) {
    this.stop();
    this.callback = cb;

    if (frame !== null) {
      this.renderFrame(frame);
    } else {
      this.loop();
    }
  }

  /**
   * Stops any running drawloop and clears all requested animation frames.
   */
  stop() {
    this.isPlaying = false;
    if (this.raf) window.cancelAnimationFrame(this.raf);
  }

  /**
   * Renders a single frame of the drawloop
   * @param {number} frame - The number of the frame to render
   */
  renderFrame(frame) {
    // We can easily calculate the timestamp of the current frame by multiplying
    // the current framecount with the fpsInterval. This yields the timestamp
    // in milliseconds.
    const time = frame * this.fpsInterval;
    if (this.callback) this.callback({ frame, time });
  }

  /**
   * Calls a callback function determined by the pace of frameRate
   */
  loop() {
    this.isPlaying = true;

    // Allow the drawloop's callback invocation to vary by 5ms around the
    // mathematically correct time to draw new frame. This is done so we do not
    // unnecessarily draw frames overextend the browser. See comment below.
    const EPSILON = 5;

    const draw = () => {
      const now = window.performance.now();
      const elapsed = now - this.lastFrameTime;

      // The Epsilon is taken from p5's solution. Also copying their
      // comment on why they do it here.
      //
      // From p5 source:
      // only draw if we really need to; don't overextend the browser.
      // draw if we're within 5ms of when our next frame should paint
      // (this will prevent us from giving up opportunities to draw
      // again when it's really about time for us to do so). fixes an
      // issue where the frameRate is too low if our refresh loop isn't
      // in sync with the browser. note that we have to draw once even
      // if looping is off, so we bypass the time delay if that
      // is the case.
      if (this.isPlaying && elapsed >= this.fpsInterval - EPSILON) {
        this.renderFrame(this.frameCount);
        this.frameCount++;
        this.lastFrameTime = now;
      }

      if (this.isPlaying) {
        this.raf = window.requestAnimationFrame(draw);
      }
    };

    draw();
  }
}

export const mechanicDrawLoop = new MechanicDrawloop();
