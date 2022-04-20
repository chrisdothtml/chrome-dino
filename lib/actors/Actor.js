import sprites from '../sprites.js'

const cache = new Map()

// analyze the pixels and create a map of the transparent
// and non-transparent pixels for hit testing
function getSpriteAlphaMap(imageData, name) {
  if (cache.has(name)) {
    return cache.get(name)
  }

  const sprite = sprites[name]
  const lines = []
  const initIVal = imageData.width * sprite.y * 4

  // for each line of pixels
  for (
    let i = initIVal;
    i < initIVal + sprite.h * imageData.width * 4;
    // (increments by 8 because it skips every other pixel due to pixel density)
    i += imageData.width * 8
  ) {
    const line = []
    const initJVal = i + sprite.x * 4
    // for each pixel in the line
    // (increments by 8 because it skips every other pixel due to pixel density)
    for (let j = initJVal; j < initJVal + sprite.w * 4; j += 8) {
      // 0 for transparent, 1 for not
      line.push(imageData.data[j + 3] === 0 ? 0 : 1)
    }

    lines.push(line)
  }

  cache.set(name, lines)
  return lines
}

export default class Actor {
  constructor(imageData) {
    this._sprite = null
    this.height = 0
    this.width = 0
    this.x = 0
    this.y = 0

    // the spriteImage should only be passed into actors that will
    // use hit detection; otherwise don't waste cpu on generating
    // the alpha map every time the sprite is set
    if (imageData) {
      this.imageData = imageData
      this.alphaMap = []
    }
  }

  set sprite(name) {
    this._sprite = name
    this.height = sprites[name].h / 2
    this.width = sprites[name].w / 2

    if (this.imageData) {
      this.alphaMap = getSpriteAlphaMap(this.imageData, name)
    }
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

      if (this.x >= actor.rightX || actor.x >= this.rightX) {
        return false
      }

      if (this.y >= actor.bottomY || actor.y >= this.bottomY) {
        return false
      }

      // actors' coords are intersecting, but they still might not be hitting
      // each other if they intersect at transparent pixels
      if (this.alphaMap && actor.alphaMap) {
        const startY = Math.round(Math.max(this.y, actor.y))
        const endY = Math.round(Math.min(this.bottomY, actor.bottomY))
        const startX = Math.round(Math.max(this.x, actor.x))
        const endX = Math.round(Math.min(this.rightX, actor.rightX))
        const thisY = Math.round(this.y)
        const actorY = Math.round(actor.y)
        const thisX = Math.round(this.x)
        const actorX = Math.round(actor.x)

        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            // doesn't hit if either are transparent at these coords
            if (this.alphaMap[y - thisY][x - thisX] === 0) continue
            if (actor.alphaMap[y - actorY][x - actorX] === 0) continue

            return true
          }
        }

        return false
      }

      return true
    })
  }
}
