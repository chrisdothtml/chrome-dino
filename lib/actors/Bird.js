import Actor from './Actor.js'
import config from '../config.js'
import { randBoolean, randInteger } from '../utils.js'

function generateYCoord (canvasHeight) {
  const maxBirdHeight = Math.max(config.sprites.birdUp.h, config.sprites.birdDown.h) / 2
  const padding = 10
  let result

  if (randBoolean()) {
    const dinoDuckHeight = 4 + (config.sprites.dinoDuckLeftLeg.h / 2)

    // make a bird you need to duck under
    result = canvasHeight - dinoDuckHeight - maxBirdHeight - padding
  } else {
    // make a bird you need to jump over
    result = randInteger(70, canvasHeight - maxBirdHeight - padding)
  }

  return result
}

export default class Bird extends Actor {
  constructor (canvasWidth, canvasHeight) {
    super()

    this.x = canvasWidth
    this.y = generateYCoord(canvasHeight)
    this.wingFrames = 0
    this.wingDirection = 'Up'
    this.sprite = `bird${this.wingDirection}`
  }

  nextFrame () {
    this.x -= config.settings.birdSpeed
    this.determineSprite()
  }

  determineSprite () {
    const oldHeight = this.height

    if (this.wingFrames >= config.settings.birdWingsRate) {
      this.wingDirection = this.wingDirection === 'Up' ? 'Down' : 'Up'
      this.wingFrames = 0
    }

    this.sprite = `bird${this.wingDirection}`
    this.wingFrames++

    // if we're switching sprites, y needs to be
    // updated for the height difference
    if (this.height !== oldHeight) {
      this.y += this.wingDirection === 'Up' ? -6 : 6
    }
  }
}
