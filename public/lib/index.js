import config from './config.js'
import 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/p5.min.js'

const { p5: P5 } = window

// eslint-disable-next-line no-new
new P5(p5 => {
  // eslint-disable-next-line no-unused-vars
  let sprite

  function spriteImage (spriteName, ...clientCoords) {
    const img = config.sprites[spriteName]
    const halfH = img.h / 2
    const halfW = img.w / 2

    // function provided for coords
    if (clientCoords.length === 1) {
      clientCoords = clientCoords[0]({ height: halfH, width: halfW })
    }

    // eslint-disable-next-line no-useless-call
    return p5.image.apply(p5, [sprite, ...clientCoords, halfW, halfH, img.x, img.y, img.w, img.h])
  }

  p5.preload = () => {
    sprite = p5.loadImage('asset-sprite.png')
  }

  p5.setup = () => {
    p5.createCanvas(600, 150)
  }

  p5.draw = () => {
    p5.background('#f7f7f7')
    spriteImage('ground', s => [ 0, (p5.height - s.height) ])
    spriteImage('dino', s => [ 25, (p5.height - s.height - 4) ])
    spriteImage('cloud', 350, 50)

    // TODO: show when game over
    // spriteImage('gameOver', s => [ (p5.width / 2 - s.width / 2), (p5.height / 2 - s.height / 2 - 20) ])
    // spriteImage('replayIcon', s => [ (p5.width / 2 - s.width / 2), (p5.height / 2 - s.height / 2 + 20) ])
  }
})
