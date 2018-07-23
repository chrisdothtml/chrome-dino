import Actor from './Actor.js'
import config from '../config.js'

export default class Dino extends Actor {
  constructor () {
    super()

    this.isDucking = false
    this.legFrames = 0
    this.legShowing = 'Left'
    this.sprite = 'dino'
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
