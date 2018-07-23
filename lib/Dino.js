import config from './config.js'

export default class Dino {
  constructor () {
    this.isDucking = false
    this.velocity = 0
    this.y = 0
  }

  jump () {
    this.velocity = -config.settings.dinoLift
  }

  duck (value) {
    this.isDucking = Boolean(value)
  }

  nextFrame () {
    // use gravity to gradually decrease velocity
    this.velocity += config.settings.dinoGravity
    this.y += this.velocity

    // stop falling once back down to the ground
    if (this.y > 0) {
      this.velocity = 0
      this.y = 0
    }
  }
}
