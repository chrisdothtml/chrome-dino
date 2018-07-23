import config from '../config.js'
import { randItem } from '../utils.js'

const VARIANTS = ['cactus', 'cactusDouble', 'cactusDoubleB', 'cactusTriple']

export default class Cactus {
  constructor (canvasWidth, canvasHeight) {
    this.sprite = randItem(VARIANTS)
    this.x = canvasWidth
    this.y = canvasHeight - this.height - 2
  }

  set sprite (name) {
    this.height = config.sprites[name].h / 2
    this._sprite = name
    this.width = config.sprites[name].w / 2
  }

  get sprite () {
    return this._sprite
  }

  nextFrame () {
    this.x -= config.settings.bgSpeed
  }
}
