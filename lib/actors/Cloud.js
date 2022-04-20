import { randInteger } from '../utils.js'
import Actor from './Actor.js'

export default class Cloud extends Actor {
  constructor(canvasWidth) {
    super()
    this.sprite = 'cloud'
    this.speedMod = randInteger(6, 14) / 10
    // these are dynamically set by the game
    this.speed = null
    this.x = null
    this.y = null
  }

  nextFrame() {
    this.x -= this.speed * this.speedMod
  }
}
