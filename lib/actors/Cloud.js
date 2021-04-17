import config from '../config.js'
import { randInteger } from '../utils.js'
import Actor from './Actor.js'

export default class Cloud extends Actor {
  constructor(canvasWidth) {
    super()
    this.sprite = 'cloud'
    this.speedMod = randInteger(6, 14) / 10
  }

  nextFrame() {
    this.x -= config.settings.cloudSpeed * this.speedMod
  }
}
