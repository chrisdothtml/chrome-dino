import { kebabToCamel } from './_utils.js'
import 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/p5.min.js'

const { p5: P5 } = window

// eslint-disable-next-line no-new
new P5(p5 => {
  const imgs = {}

  p5.preload = () => {
    const imageNames = [
      'bird-sprite',
      'cactus-double',
      'cactus-single',
      'cactus-triple',
      'cloud',
      'dino-sprite',
      'restart-icon'
    ]

    imageNames.forEach(name => {
      imgs[kebabToCamel(name)] = p5.loadImage(`assets/${name}.png`)
    })
  }

  p5.setup = () => {
    p5.createCanvas(600, 150)
  }

  p5.draw = () => {
    //
  }
})
