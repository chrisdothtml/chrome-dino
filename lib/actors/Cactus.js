import config from '../config.js'

export default class Cactus {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  nextFrame () {
    this.x -= config.settings.bgSpeed
  }
}
