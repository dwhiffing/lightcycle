import Map from '../gameObjects/map'
import UI from '../gameObjects/ui'

// add wildcard tile
// clear tiles inside loop
// sounds
// fancy effects on placing/clearing tiles
// title graphic
// add credits/help
// prevent marker from being outside playing area

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init(opts) {
    this.input.keyboard.removeAllKeys(true)
    this.keys = this.input.keyboard.addKeys('W,A,S,D,Q,E,R,SPACE')
    this.keys.W.on('down', () => this.move('up'))
    this.keys.A.on('down', () => this.move('left'))
    this.keys.S.on('down', () => this.move('down'))
    this.keys.D.on('down', () => this.move('right'))
    this.keys.Q.on('down', () => this.rotate(-1))
    this.keys.E.on('down', () => this.rotate(1))
    this.keys.R.on('down', () => this.hold())
    this.keys.SPACE.on('down', this.placeTiles.bind(this))
  }

  create() {
    this.map = new Map(this)
    this.ui = new UI(this)

    this.time.addEvent({
      delay: 100,
      repeat: -1,
      callback: this.tick.bind(this),
    })
  }

  tick() {
    this.ui.tickTimer()
    if (this.ui.timer < 1) this.loseLife()
  }

  move(direction) {
    this.ui.moveMarker(direction)
  }

  rotate(direction) {
    this.ui.rotateMarker(direction)
  }

  hold() {
    this.ui.hold()
  }

  // TODO: Refactor me
  placeTiles() {
    const { x, y } = this.ui.marker

    const canPlaceTile = this.ui
      .getMarkerTiles()
      .every((tile) => tile === -1 || (tile && tile.index < 2))

    if (!canPlaceTile) return

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

  loseLife() {
    this.ui.updateLives(-1)
    this.ui.getNewTile()
    if (this.registry.get('lives') < 0) {
      this.scene.start('Menu')
    }
  }
}
