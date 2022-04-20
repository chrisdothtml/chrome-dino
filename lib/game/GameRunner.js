export default class GameRunner {
  constructor() {
    this.looping = false
    this.preloaded = false
    this.targetFrameRate = 60
    this.frameCount = 0
    this.frameRate = 0
    this.paused = false
    this.stepFrames = null
    this._lastFrameTime = window.performance.now()

    // store this bound function so we don't have to create
    // one every single time we call requestAnimationFrame
    this.__loop = this._loop.bind(this)
  }

  async start(paused = false) {
    if (!this.preloaded) {
      if (this.preload) {
        await this.preload()
      }
      this.preloaded = true
    }

    if (paused) {
      this.paused = paused
    }

    this.looping = true

    if (!paused) {
      window.requestAnimationFrame(this.__loop)
    }
  }

  stop() {
    this.looping = false
  }

  pause() {
    this.paused = true
  }

  unpause() {
    this.paused = false
  }

  step(frames = 1) {
    if (typeof this.stepFrames === 'number') {
      this.stepFrames += frames
    } else {
      this.stepFrames = frames
    }

    this.__loop(window.performance.now())
  }

  _loop(timestamp) {
    const now = window.performance.now()
    const timeSinceLast = now - this._lastFrameTime
    const targetTimeBetweenFrames = 1000 / this.targetFrameRate

    if (timeSinceLast >= targetTimeBetweenFrames - 5) {
      this.onFrame()
      this.frameRate = 1000 / (now - this._lastFrameTime)
      this._lastFrameTime = now
      this.frameCount++
    }

    if (this.looping) {
      let shouldLoop = true

      if (this.paused) {
        if (typeof this.stepFrames === 'number') {
          if (this.stepFrames === 0) {
            this.stepFrames = null
            shouldLoop = false
          } else {
            this.stepFrames--
          }
        } else {
          shouldLoop = false
        }
      }

      if (shouldLoop) {
        window.requestAnimationFrame(this.__loop)
      }
    }
  }
}
