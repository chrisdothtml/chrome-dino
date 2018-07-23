import config from '../config.js'

export default class Dino {
  constructor () {
    this.isDucking = false
    this.legFrames = 0
    this.legShowing = 'Left'
    this.sprite = 'dino'
    this.velocity = 0
    this.y = 0
  }

  set sprite (name) {
    this.height = config.sprites[name].h / 2
    this._sprite = name
    this.width = config.sprites[name].w / 2
  }

  get sprite () {
    return this._sprite
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

    this.determineSprite()
  }

  determineSprite () {
    if (this.y < 0) {
      // in the air stiff
      this.sprite = 'dino'
    } else {
      // on the ground running
      if (this.legFrames >= config.settings.dinoLegsRate) {
        this.legShowing = this.legShowing === 'Left' ? 'Right' : 'Left'
        this.legFrames = 0
      }

      if (this.isDucking) {
        this.sprite = `dinoDuck${this.legShowing}Leg`
      } else {
        this.sprite = `dino${this.legShowing}Leg`
      }

      this.legFrames++
    }
  }
}
