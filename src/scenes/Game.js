import Map from '../gameObjects/map'
import UI from '../gameObjects/ui'

// score multiplier (level), increases as loops are gained
// higher level means faster timer
// higher level means more complex pieces
// add wildcard tile
// show blocking tiles as red

// sounds
// fancy effects on placing/clearing tiles
// title graphic
// add credit

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init(opts) {}

  create() {
    this.map = new Map(this)
    this.ui = new UI(this)

    this.keys = this.input.keyboard.addKeys('W,A,S,D,Q,E,R,SPACE')
    this.keys.W.on('down', () => this.move('up'))
    this.keys.A.on('down', () => this.move('left'))
    this.keys.S.on('down', () => this.move('down'))
    this.keys.D.on('down', () => this.move('right'))
    this.keys.Q.on('down', () => this.rotate(-1))
    this.keys.E.on('down', () => this.rotate(1))
    this.keys.R.on('down', () => this.hold())
    this.keys.SPACE.on('down', this.placeTiles.bind(this))

    this.time.addEvent({
      delay: 100,
      repeat: -1,
      callback: this.updateTimer.bind(this),
    })
  }

  move(direction) {
    this.ui.moveMarker(direction)
  }

  hold() {
    this.ui.hold()
  }

  rotate(direction) {
    this.ui.rotateMarker(direction)
  }

  placeTiles() {
    const { x, y } = this.ui.marker

    if (!this.canPlaceTile()) return

    this.ui.marker.frames.forEach((frame, index) => {
      const _x = (x - 2) / 5 + (index % 3)
      const _y = y / 5 + window.Math.floor(index / 3)
      if (frame > -1) this.map.placeTile(_x, _y, frame)
    })

    const loop = this.map.getLoop()
    if (loop) {
      this.map.clearTiles(loop)
      this.ui.updateScore(loop.length * 100)
    }
    this.ui.getNewTile()
  }

  canPlaceTile() {
    const { x, y, frames } = this.ui.marker
    return frames.every((frame, index) => {
      const _x = (x - 2) / 5 + (index % 3)
      const _y = y / 5 + window.Math.floor(index / 3)
      if (frame === -1) return true
      const targetTile = this.map.map.getTileAt(_x, _y, frame)
      return targetTile ? targetTile.index < 2 : false
    })
  }

  updateTimer() {
    this.ui.tickTimer()
    if (this.ui.timer < 1) {
      this.ui.updateLives(-1)
      this.ui.getNewTile()
      if (this.registry.get('lives') < 0) {
        this.scene.start('Menu')
      }
    }
  }

  update() {}
}
