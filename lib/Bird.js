import config from './config.js'

export default class Bird {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  nextFrame () {
    this.x -= config.settings.birdSpeed
  }
}
