import config from './config.js'
import 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/p5.min.js'

const BG_SPEED = 3
const { p5: P5 } = window

// eslint-disable-next-line no-new
new P5(p5 => {
  const STATE = {
    groundX: 0,
    groundY: 0
  }
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

  function drawGround () {
    const groundImgWidth = config.sprites.ground.w / 2

    spriteImage('ground', s => [ STATE.groundX, STATE.groundY ])
    STATE.groundX -= BG_SPEED

    // append second image until first is fully translated
    if (STATE.groundX <= -groundImgWidth + p5.width) {
      spriteImage('ground', s => [ (STATE.groundX + groundImgWidth), STATE.groundY ])

      if (STATE.groundX <= -groundImgWidth) {
        STATE.groundX = 0
      }
    }
  }

  p5.preload = () => {
    sprite = p5.loadImage('asset-sprite.png')
  }

  p5.setup = () => {
    p5.createCanvas(600, 150)
    STATE.groundY = p5.height - config.sprites.ground.h / 2
  }

  p5.draw = () => {
    p5.background('#f7f7f7')
    drawGround()
    spriteImage('dino', s => [ 25, (p5.height - s.height - 4) ])
    spriteImage('cloud', 350, 50)

    // TODO: show when game over
    // spriteImage('gameOver', s => [ (p5.width / 2 - s.width / 2), (p5.height / 2 - s.height / 2 - 20) ])
    // spriteImage('replayIcon', s => [ (p5.width / 2 - s.width / 2), (p5.height / 2 - s.height / 2 + 20) ])
  }
})
