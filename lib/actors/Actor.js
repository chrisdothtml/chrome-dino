import config from '../config.js'

export default class Actor {
  constructor() {
    this._sprite = null
    this.height = 0
    this.width = 0
    this.x = 0
    this.y = 0
  }

  set sprite(name) {
    this._sprite = name
    this.height = config.sprites[name].h / 2
    this.width = config.sprites[name].w / 2
  }

  get sprite() {
    return this._sprite
  }

  // the x value of the right side of it
  get rightX() {
    return this.width + this.x
  }

  // the y value of the bottom of it
  get bottomY() {
    return this.height + this.y
  }

  hits(actors) {
    return actors.some((actor) => {
      if (!actor) return false

      if (this.x >= actor.x + actor.width || actor.x >= this.x + this.width) {
        return false
      }

      if (this.y >= actor.y + actor.height || actor.y >= this.y + this.height) {
        return false
      }

      return true
    })
  }
}
