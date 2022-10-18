let instance,
  isPlaying = false,
  frameRate,
  fpsInterval,
  frameCount,
  lastFrameTime,
  raf,
  callback;

const epsilon = 5;

class MechanicDrawloop {
  /**
   * Drawloop constructor. The drawloop is realized as a singleton. Making sure
   * there is only one instance of the drawloop is needed so we can easily clear
   * any pending animation frames when it's time to update a design function due
   * to code changes or new input values.
   */
  constructor() {
    if (instance)
      throw new Error(
        "There should only be one instance of the draw loop at any given time"
      );
    instance = this;
  }

  /**
   * Prepare the drawloop with a frameRate
   * @param {number} frameRate - The frameRate to use for the drawloop
   */
  prepare(frameRate) {
    frameRate = frameRate;
    fpsInterval = 1000 / frameRate;
    lastFrameTime = 0;
    frameCount = 0;
    callback = null;

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
    callback = cb;

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
    isPlaying = false;
    if (raf) window.cancelAnimationFrame(this.raf);
  }

  /**
   * Renders a single frame of the drawloop
   * @param {number} frame - The number of the frame to render
   */
  renderFrame(frame) {
    if (callback) callback.call(null, frame);
  }

  /**
   * Calls a callback function determined by the pace of frameRate
   */
  loop() {
    isPlaying = true;

    const draw = () => {
      const now = window.performance.now();
      const elapsed = now - lastFrameTime;

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
      if (isPlaying && elapsed >= fpsInterval - epsilon) {
        this.renderFrame(frameCount);
        frameCount++;
        lastFrameTime = now;
      }

      if (isPlaying) {
        raf = window.requestAnimationFrame(draw);
      }
    };

    draw();
  }
}

export const mechanicDrawLoop = Object.freeze(new MechanicDrawloop());
