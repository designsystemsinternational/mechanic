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
  constructor() {
    if (instance)
      throw new Error("There should only be one instance of the draw loop at any given time");
    instance = this;
  }

  prepare(settings) {
    // Make sure to clear any draw loop that might still be running
    frameRate = settings.frameRate;
    fpsInterval = 1000 / frameRate;
    lastFrameTime = 0;
    frameCount = 0;
    callback = null;
  }

  stop() {
    isPlaying = false;
    if (raf) window.cancelAnimationFrame(this.raf);
  }

  start() {
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
        callback.call(null, { frameCount: frameCount });
        frameCount++;
        lastFrameTime = now;
      }

      if (isPlaying) {
        raf = window.requestAnimationFrame(draw);
      }
    };

    draw();
  }

  maybeDisptach(cb, isAnimated = false) {
    this.stop();

    if (isAnimated) {
      isPlaying = true;
      callback = cb;
      this.start();
    } else {
      cb.call(null, { frameCount: null });
    }
  }
}

export const mechanicDrawLoop = Object.freeze(new MechanicDrawloop());
