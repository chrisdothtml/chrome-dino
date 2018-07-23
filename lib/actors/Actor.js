import config from '../config.js'

export default class Actor {
  constructor () {
    this._sprite = null
    this.height = 0
    this.width = 0
  }

  set sprite (name) {
    this.height = config.sprites[name].h / 2
    this._sprite = name
    this.width = config.sprites[name].w / 2
  }

  get sprite () {
    return this._sprite
  }
}
