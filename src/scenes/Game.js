import Map from '../gameObjects/map'
import UI from '../gameObjects/ui'
import Marker from '../gameObjects/marker'

// add wildcard tile
// clear tiles inside loop
// sounds
// fancy effects on placing/clearing tiles
// title graphic
// add credits/help
// prevent marker from being outside playing area
// add key repeat on hold

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {}

  create() {
    this.registry.set('score', 0)
    this.registry.set('lives', 3)
    this.registry.set('multi', 1)

    this.input.keyboard.removeAllKeys(true)
    this.keys = this.input.keyboard.addKeys('W,A,S,D,Q,E,R,SPACE')

    this.map = new Map(this)
    this.ui = new UI(this)
    this.marker = new Marker(this)

    this.keys.W.on('down', this.marker.moveUp)
    this.keys.A.on('down', this.marker.moveLeft)
    this.keys.S.on('down', this.marker.moveDown)
    this.keys.D.on('down', this.marker.moveRight)
    this.keys.Q.on('down', this.marker.rotateLeft)
    this.keys.E.on('down', this.marker.rotateRight)
    this.keys.R.on('down', this.marker.hold)
    this.keys.SPACE.on('down', this.placeTiles)

    this.time.addEvent({ delay: 100, repeat: -1, callback: this.tick })
  }

  tick = () => {
    this.ui.timer -= 100
    this.ui.renderTimer()
    if (this.ui.timer < 1) this.loseLife()
  }

  placeTiles = () => {
    if (!this.marker.canPlaceTiles()) return

    this.marker.placeTiles()

    const loop = this.map.getLoop()
    if (loop) {
      this.map.clearTiles(loop)
      this.ui.updateScore(loop.length * 100)
    }
    this.marker.getNextMino()
    this.ui.resetTimer()
  }

  loseLife = () => {
    this.ui.updateLives(-1)
    this.marker.getNextMino()
    this.ui.resetTimer()
    if (this.registry.get('lives') < 0) {
      this.scene.start('Menu')
    }
  }
}
