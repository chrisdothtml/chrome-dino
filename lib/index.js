import Bird from './Bird.js'
import Cactus from './Cactus.js'
import Cloud from './Cloud.js'
import config from './config.js'
import Dino from './Dino.js'
import 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/p5.min.js'

const { p5: P5 } = window
window.config = config

// eslint-disable-next-line no-new
new P5(p5 => {
  window.p5 = p5
  // for resetting settings that change due to
  // difficulty increasing
  const SETTINGS_BACKUP = { ...config.settings }
  const STATE = {
    birds: [],
    cacti: [],
    clouds: [],
    dino: null,
    dinoLeg: 'Left',
    dinoLegFrames: 0,
    gameOver: false,
    groundX: 0,
    groundY: 0,
    isRunning: false,
    level: 0,
    score: 0
  }
  window.state = STATE
  // eslint-disable-next-line no-unused-vars
  let PressStartFont, sprite

  function randBoolean () {
    return Boolean(Math.round(p5.random(0, 1)))
  }

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
      birds: [],
      cacti: [],
      dino: new Dino(),
      gameOver: false,
      groundX: 0,
      isRunning: true,
      level: 0,
      score: 0
    })

    Object.assign(config.settings, SETTINGS_BACKUP)
    p5.loop()
  }

  function endGame () {
    const padding = 15

    p5.fill('#535353')
    p5.textAlign(p5.CENTER)
    p5.textFont(PressStartFont)
    p5.textSize(12)
    p5.text('G A M E  O V E R', (p5.width / 2), (p5.height / 2 - p5.textSize() / 2 - padding))
    spriteImage('replayIcon', s => [ (p5.width / 2 - s.width / 2), (p5.height / 2 - s.height / 2 + padding) ])

    STATE.isRunning = false
    p5.noLoop()
  }

  function updateScore () {
    if (p5.frameCount % config.settings.scoreIncreaseRate === 0) {
      const oldLevel = STATE.level

      STATE.score++
      STATE.level = Math.floor(STATE.score / 100)

      // increase difficulty
      if (STATE.level !== oldLevel) {
        const { settings } = config
        const { bgSpeed, cactiSpawnRate, dinoLegsRate } = settings
        const { level } = STATE

        if (level > 4 && level < 8) {
          settings.bgSpeed++
          settings.birdSpeed = settings.bgSpeed * 0.8
        } else if (level > 7) {
          settings.bgSpeed = Math.ceil(bgSpeed * 1.1)
          settings.birdSpeed = settings.bgSpeed * 0.8
          settings.cactiSpawnRate = Math.floor(cactiSpawnRate * 0.98)

          if (level > 7 && level % 2 === 0 && dinoLegsRate > 3) {
            settings.dinoLegsRate--
          }
        }
      }
    }
  }

  function drawGround () {
    const { bgSpeed } = config.settings
    const groundImgWidth = config.sprites.ground.w / 2

    spriteImage('ground', s => [ STATE.groundX, STATE.groundY ])
    STATE.groundX -= bgSpeed

    // append second image until first is fully translated
    if (STATE.groundX <= -groundImgWidth + p5.width) {
      spriteImage('ground', s => [ (STATE.groundX + groundImgWidth), STATE.groundY ])

      if (STATE.groundX <= -groundImgWidth) {
        STATE.groundX = -bgSpeed
      }
    }
  }

  function drawClouds () {
    const { clouds } = STATE

    for (let i = clouds.length - 1; i >= 0; i--) {
      const cloud = clouds[i]

      cloud.nextFrame()

      if (cloud.x <= -config.sprites.cloud.w / 2) {
        // remove if off screen
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
        // on the ground running
        if (STATE.dinoLegFrames >= config.settings.dinoLegsRate) {
          STATE.dinoLeg = STATE.dinoLeg === 'Left' ? 'Right' : 'Left'
          STATE.dinoLegFrames = 0
        }

        if (dino.isDucking) {
          dinoSprite = `dinoDuck${STATE.dinoLeg}Leg`
        } else {
          dinoSprite = `dino${STATE.dinoLeg}Leg`
        }

        STATE.dinoLegFrames++
      }

      spriteImage(dinoSprite, s => [ 25, (p5.height - s.height - 4 + dino.y) ])
    } else {
      spriteImage('dino', s => [ 25, (p5.height - s.height - 4) ])
    }
  }

  function drawCacti () {
    const { cacti } = STATE

    for (let i = cacti.length - 1; i >= 0; i--) {
      const cactus = cacti[i]

      cactus.nextFrame()

      if (cactus.x <= -config.sprites.cactus.w / 2) {
        // remove if off screen
        cacti.splice(i, 1)
      } else {
        spriteImage('cactus', cactus.x, cactus.y)
      }
    }

    if (p5.frameCount % config.settings.cactiSpawnRate === 0) {
      // randomly either do or don't add cactus
      if (randBoolean()) {
        cacti.push(
          new Cactus(p5.width, (p5.height - config.sprites.cactus.h / 2 - 2))
        )
      }
    }
  }

  function drawScore () {
    p5.fill('#535353')
    p5.textAlign(p5.RIGHT)
    p5.textFont(PressStartFont)
    p5.textSize(12)
    p5.text((STATE.score + '').padStart(5, '0'), p5.width, p5.textSize())
  }

  function drawBirds () {
    const { birds } = STATE

    for (let i = birds.length - 1; i >= 0; i--) {
      const bird = birds[i]

      bird.nextFrame()

      if (bird.x <= -config.sprites.birdUp.w / 2) {
        // remove if off screen
        birds.splice(i, 1)
      } else {
        spriteImage('birdUp', bird.x, bird.y)
      }
    }

    if (p5.frameCount % config.settings.birdSpawnRate === 0) {
      // randomly either do or don't add bird
      if (randBoolean()) {
        const maxBirdHeight = Math.max(config.sprites.birdUp.h, config.sprites.birdDown.h) / 2
        const birdType = randBoolean() ? 'jumpOver' : 'duckUnder'
        let y

        if (birdType === 'duckUnder') {
          const dinoHeight = 4 + (config.sprites.dinoDuckLeftLeg.h / 2)
          const padding = 4

          // calculate y coord that allows dino to duck
          // under it without hitting
          y = p5.height - dinoHeight - maxBirdHeight - padding
        } else if (birdType === 'jumpOver') {
          const padding = 10

          // calculate y coord that allows dino to jump
          // over it without hitting
          y = p5.random(70, p5.height - maxBirdHeight - padding)
        }

        birds.push(new Bird(p5.width, y))
      }
    }
  }

  // triggered on pageload
  p5.preload = () => {
    PressStartFont = p5.loadFont('assets/PressStart2P-Regular.ttf')
    sprite = p5.loadImage('assets/sprite.png')
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
    drawCacti()
    drawScore()

    if (STATE.level > 3) {
      drawBirds()
    }

    // TODO: hit detection

    if (STATE.gameOver) {
      endGame()
    } else {
      updateScore()
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
    } else if (p5.keyCode === p5.DOWN_ARROW) {
      if (STATE.isRunning) {
        STATE.dino.duck(true)
      }
    }
  }

  p5.keyReleased = () => {
    if (p5.keyCode === p5.DOWN_ARROW) {
      STATE.dino.duck(false)
    }
  }
})
