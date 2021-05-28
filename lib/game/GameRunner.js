export default class GameRunner {
  constructor() {
    this.looping = false
    this.preloaded = false
    this.targetFrameRate = 60
    this.frameCount = 0
    this.frameRate = 0
    this._lastFrameTime = window.performance.now()

    // store this bound function so we don't have to create
    // one every single time we call requestAnimationFrame
    this.__loop = this._loop.bind(this)
  }

  async start() {
    if (!this.preloaded) {
      if (this.preload) {
        await this.preload()
      }
      this.preloaded = true
    }

    this.looping = true
    window.requestAnimationFrame(this.__loop)
  }

  stop() {
    this.looping = false
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
      window.requestAnimationFrame(this.__loop)
    }
  }
}
