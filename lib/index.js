import Bird from './actors/Bird.js'
import Cactus from './actors/Cactus.js'
import Cloud from './actors/Cloud.js'
import config from './config.js'
import Dino from './actors/Dino.js'
import { randBoolean, randInteger } from './utils.js'
import 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/p5.min.js'

/**
 * @typedef {import('./actors/Actor.js')} Actor
 */

const { p5: P5 } = window
window.config = config

// eslint-disable-next-line no-new
new P5((p5) => {
  // for resetting settings that change due to
  // difficulty increasing
  const SETTINGS_BACKUP = { ...config.settings }
  const STATE = {
    birds: [],
    cacti: [],
    clouds: [],
    dino: null,
    gameOver: false,
    groundX: 0,
    groundY: 0,
    isRunning: false,
    level: 0,
    score: 0,
  }
  // eslint-disable-next-line no-unused-vars
  let PressStartFont, spriteImage

  // global references for debugging
  window.p5 = p5
  window.state = STATE

  function paintSprite(spriteName, ...clientCoords) {
    const { h, w, x, y } = config.sprites[spriteName]

    // eslint-disable-next-line no-useless-call
    return p5.image.apply(p5, [
      spriteImage,
      ...clientCoords,
      w / 2,
      h / 2,
      x,
      y,
      w,
      h,
    ])
  }

  function resetGame() {
    STATE.dino.reset()
    Object.assign(STATE, {
      birds: [],
      cacti: [],
      gameOver: false,
      isRunning: true,
      level: 0,
      score: 0,
    })

    Object.assign(config.settings, SETTINGS_BACKUP)
    p5.loop()
  }

  function endGame() {
    const iconSprite = config.sprites.replayIcon
    const padding = 15

    p5.fill('#535353')
    p5.textAlign(p5.CENTER)
    p5.textFont(PressStartFont)
    p5.textSize(12)
    p5.text(
      'G A M E  O V E R',
      p5.width / 2,
      p5.height / 2 - p5.textSize() / 2 - padding
    )
    paintSprite(
      'replayIcon',
      p5.width / 2 - iconSprite.w / 4,
      p5.height / 2 - iconSprite.h / 4 + padding
    )

    STATE.isRunning = false
    p5.noLoop()
  }

  function increaseDifficulty() {
    const { settings } = config
    const { bgSpeed, cactiSpawnRate, dinoLegsRate } = settings
    const { level } = STATE

    if (level > 4 && level < 8) {
      settings.bgSpeed++
      settings.birdSpeed = settings.bgSpeed * 0.8
    } else if (level > 7) {
      settings.bgSpeed = Math.ceil(bgSpeed * 1.1)
      settings.birdSpeed = settings.bgSpeed * 0.9
      settings.cactiSpawnRate = Math.floor(cactiSpawnRate * 0.98)

      if (level > 7 && level % 2 === 0 && dinoLegsRate > 3) {
        settings.dinoLegsRate--
      }
    }
  }

  function updateScore() {
    if (p5.frameCount % config.settings.scoreIncreaseRate === 0) {
      const oldLevel = STATE.level

      STATE.score++
      STATE.level = Math.floor(STATE.score / 100)

      if (STATE.level !== oldLevel) {
        increaseDifficulty()
      }
    }
  }

  /**
   * For each instance in the provided array, calculate the next
   * frame and remove any that are no longer visible
   * @param {Actor[]} instances
   */
  function progressInstances(instances) {
    for (let i = instances.length - 1; i >= 0; i--) {
      const instance = instances[i]

      instance.nextFrame()
      if (instance.rightX <= 0) {
        // remove if off screen
        instances.splice(i, 1)
      }
    }
  }

  /**
   * @param {Actor[]} instances
   */
  function paintInstances(instances) {
    for (const instance of instances) {
      paintSprite(instance.sprite, instance.x, instance.y)
    }
  }

  function drawGround() {
    const { bgSpeed } = config.settings
    const groundImgWidth = config.sprites.ground.w / 2

    paintSprite('ground', STATE.groundX, STATE.groundY)
    STATE.groundX -= bgSpeed

    // append second image until first is fully translated
    if (STATE.groundX <= -groundImgWidth + p5.width) {
      paintSprite('ground', STATE.groundX + groundImgWidth, STATE.groundY)

      if (STATE.groundX <= -groundImgWidth) {
        STATE.groundX = -bgSpeed
      }
    }
  }

  function drawClouds() {
    const { clouds } = STATE

    progressInstances(clouds)
    if (p5.frameCount % config.settings.cloudSpawnRate === 0) {
      const newCloud = new Cloud()
      newCloud.x = p5.width
      newCloud.y = randInteger(20, 80)
      clouds.push(newCloud)
    }
    paintInstances(clouds)
  }

  function drawDino() {
    const { dino } = STATE

    dino.nextFrame()
    paintSprite(dino.sprite, dino.x, dino.y)
  }

  function drawCacti() {
    const { cacti } = STATE

    progressInstances(cacti)
    if (p5.frameCount % config.settings.cactiSpawnRate === 0) {
      // randomly either do or don't add cactus
      if (randBoolean()) {
        const newCacti = new Cactus(spriteImage)
        newCacti.x = p5.width
        newCacti.y = p5.height - newCacti.height - 2
        cacti.push(newCacti)
      }
    }
    paintInstances(cacti)
  }

  function drawScore() {
    p5.fill('#535353')
    p5.textAlign(p5.RIGHT)
    p5.textFont(PressStartFont)
    p5.textSize(12)
    p5.text((STATE.score + '').padStart(5, '0'), p5.width, p5.textSize())
  }

  function drawBirds() {
    const { birds } = STATE

    progressInstances(birds)
    if (p5.frameCount % config.settings.birdSpawnRate === 0) {
      // randomly either do or don't add bird
      if (randBoolean()) {
        const newBird = new Bird(spriteImage)
        newBird.x = p5.width
        newBird.y = randInteger(70, p5.height - Bird.maxBirdHeight - 10)
        birds.push(newBird)
      }
    }
    paintInstances(birds)
  }

  // triggered on pageload
  p5.preload = () => {
    PressStartFont = p5.loadFont('assets/PressStart2P-Regular.ttf')
    spriteImage = p5.loadImage('assets/sprite.png')
  }

  // triggered after preload
  p5.setup = () => {
    const canvas = p5.createCanvas(600, 150)
    spriteImage.loadPixels()
    const dino = new Dino(spriteImage)

    dino.x = 25
    dino.baseY = p5.height - 4
    STATE.dino = dino
    STATE.groundY = p5.height - config.sprites.ground.h / 2
    p5.noLoop()

    canvas.mouseClicked(() => {
      if (STATE.gameOver) {
        resetGame()
      }
    })
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

    if (STATE.dino.hits([STATE.cacti[0], STATE.birds[0]])) {
      STATE.gameOver = true
    }

    if (STATE.gameOver) {
      endGame()
    } else {
      updateScore()
    }
  }

  p5.keyPressed = () => {
    if (p5.key === ' ' || p5.keyCode === p5.UP_ARROW) {
      if (STATE.isRunning) {
        STATE.dino.jump()
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
