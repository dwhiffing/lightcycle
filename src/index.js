import Phaser from 'phaser'
import * as scenes from './scenes'

var config = {
  type: Phaser.AUTO,
  width: 64,
  height: 64,
  backgroundColor: '#000',
  pixelArt: true,
  zoom: 4,
  parent: 'phaser-example',
  scale: {
    mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
  },
  // debug: true,
  scene: Object.values(scenes),
}

window.game = new Phaser.Game(config)

const aButton = document.getElementById('a-button')
const bButton = document.getElementById('b-button')
const upButton = document.getElementById('up-button')
const downButton = document.getElementById('down-button')
const leftButton = document.getElementById('left-button')
const rightButton = document.getElementById('right-button')

window.oncontextmenu = function (event) {
  event.preventDefault()
  event.stopPropagation()
  return false
}

let interval, timeout
const cancel = () => {
  clearTimeout(timeout)
  clearInterval(interval)
}
const attachUpDown = (el, key) => {
  el.addEventListener('pointerdown', () => {
    game.events.emit(key)
    if (key === 'a-button') return
    const delay = key === 'b-button' ? 400 : 200
    timeout = setTimeout(() => {
      if (key === 'b-button') {
        game.events.emit('c-button')
      } else {
        game.events.emit(key)
        interval = setInterval(() => game.events.emit(key), 35)
      }
    }, delay)
  })

  el.addEventListener('pointerup', cancel)
}

window.addEventListener('pointerup', cancel)
window.addEventListener('pointercancel', cancel)

attachUpDown(upButton, 'up-button')
attachUpDown(downButton, 'down-button')
attachUpDown(leftButton, 'left-button')
attachUpDown(rightButton, 'right-button')
attachUpDown(aButton, 'a-button')
attachUpDown(bButton, 'b-button')
