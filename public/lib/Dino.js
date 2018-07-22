import config from './config.js'

export default class Dino {
  constructor () {
    this.velocity = 0
    this.y = 0
  }

  jump () {
    this.velocity = -config.settings.dinoLift
  }

  nextFrame () {
    this.velocity += config.settings.dinoGravity
    this.y += this.velocity

    if (this.y > 0) {
      this.velocity = 0
      this.y = 0
    }
  }
}
