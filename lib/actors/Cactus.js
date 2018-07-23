import Actor from './Actor.js'
import config from '../config.js'
import { randItem } from '../utils.js'

const VARIANTS = ['cactus', 'cactusDouble', 'cactusDoubleB', 'cactusTriple']

export default class Cactus extends Actor {
  constructor (canvasWidth, canvasHeight) {
    super()

    this.sprite = randItem(VARIANTS)
    this.x = canvasWidth
    this.y = canvasHeight - this.height - 2
  }

  nextFrame () {
    this.x -= config.settings.bgSpeed
  }
}
