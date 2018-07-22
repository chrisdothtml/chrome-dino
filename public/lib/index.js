import config from './config.js'
import Cloud from './Cloud.js'
import Dino from './Dino.js'
import 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/p5.min.js'

const { p5: P5 } = window

// eslint-disable-next-line no-new
new P5(p5 => {
  window.p5 = p5
  const STATE = {
    clouds: [],
    dino: null,
    dinoLeg: 'Left',
    dinoLegFrames: 0,
    gameOver: false,
    groundX: 0,
    groundY: 0,
    isRunning: false
  }
  window.state = STATE
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

  function resetGame () {
    Object.assign(STATE, {
      clouds: [],
      dino: new Dino(),
      gameOver: false,
      groundX: 0,
      isRunning: true
    })

    p5.loop()
  }

  function endGame () {
    const padding = 20

    spriteImage('gameOver', s => [ (p5.width / 2 - s.width / 2), (p5.height / 2 - s.height / 2 - padding) ])
    spriteImage('replayIcon', s => [ (p5.width / 2 - s.width / 2), (p5.height / 2 - s.height / 2 + padding) ])
    STATE.isRunning = false
    p5.noLoop()
  }

  function drawGround () {
    const groundImgWidth = config.sprites.ground.w / 2

    spriteImage('ground', s => [ STATE.groundX, STATE.groundY ])
    STATE.groundX -= config.settings.bgSpeed

    // append second image until first is fully translated
    if (STATE.groundX <= -groundImgWidth + p5.width) {
      spriteImage('ground', s => [ (STATE.groundX + groundImgWidth), STATE.groundY ])

      if (STATE.groundX <= -groundImgWidth) {
        STATE.groundX = 0
      }
    }
  }

  function drawClouds () {
    const { clouds } = STATE

    for (let i = clouds.length - 1; i >= 0; i--) {
      const cloud = clouds[i]

      cloud.nextFrame()

      if (cloud.x <= -config.sprites.cloud.w / 2) {
        clouds.splice(i, 1)
      } else {
        spriteImage('cloud', cloud.x, cloud.y)
      }
    }

    if (p5.frameCount % 200 === 0) {
      clouds.push(
        new Cloud(p5.width, p5.random(20, 80), p5.random(0.6, 1.4))
      )
    }
  }

  function drawDino () {
    const { dino } = STATE

    if (dino) {
      let dinoSprite

      dino.nextFrame()

      if (dino.y < 0) {
        // in the air stiff
        dinoSprite = 'dino'
      } else {
        if (STATE.dinoLegFrames >= 6) {
          STATE.dinoLeg = STATE.dinoLeg === 'Left' ? 'Right' : 'Left'
          STATE.dinoLegFrames = 0
        }

        // on the ground running
        dinoSprite = `dino${STATE.dinoLeg}Leg`
        STATE.dinoLegFrames++
      }

      spriteImage(dinoSprite, s => [ 25, (p5.height - s.height - 4 + dino.y) ])
    } else {
      spriteImage('dino', s => [ 25, (p5.height - s.height - 4) ])
    }
  }

  // triggered on pageload
  p5.preload = () => {
    sprite = p5.loadImage('asset-sprite.png')
  }

  // triggered after preload
  p5.setup = () => {
    p5.createCanvas(600, 150)
    STATE.groundY = p5.height - config.sprites.ground.h / 2
    p5.noLoop()
  }

  // triggered for every frame
  p5.draw = () => {
    p5.background('#f7f7f7')
    drawGround()
    drawClouds()
    drawDino()

    if (STATE.gameOver) {
      endGame()
    }
  }

  p5.keyPressed = () => {
    if (p5.key === ' ' || p5.keyCode === p5.UP_ARROW) {
      if (STATE.isRunning) {
        if (STATE.dino.y === 0) {
          STATE.dino.jump()
        }
      } else {
        resetGame()
      }
    }
  }
})
