import 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/p5.min.js'

function preload () {
  //
}

function setup () {
  createCanvas(600, 150)
}

function draw () {
  //
}

// necessary for using p5 from esmodule
Object.assign(window, { draw, preload, setup })
new window.p5()
