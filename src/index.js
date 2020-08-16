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
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
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

const emit = (key) => {
  game.events.emit(key)
  window.navigator.vibrate && window.navigator.vibrate(50)
}

let interval, timeout
const cancel = () => {
  clearTimeout(timeout)
  clearInterval(interval)
}
const attachUpDown = (el, key) => {
  el.addEventListener('pointerdown', () => {
    emit(key)
    
    if (key === 'a-button') return
    const delay = key === 'b-button' ? 400 : 200
    timeout = setTimeout(() => {
      if (key === 'b-button') {
        emit('c-button')
      } else {
        emit(key)
        interval = setInterval(() => emit(key), 35)
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

if (window.matchMedia('(pointer: coarse)').matches) {
  window.document.body.classList.add('touch')
}

window.addEventListener('keydown', (event) => {
  if (event.key !== 'p') return
  if (game.scene.isPaused('Game')) {
    game.sound.play('click')
    game.scene.resume('Game')
  } else {
    game.sound.play('move', { volume: 0.25, rate: 1.5 })
    game.scene.pause('Game')
  }
})
