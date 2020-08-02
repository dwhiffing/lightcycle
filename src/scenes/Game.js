import Map from '../gameObjects/map'
import UI from '../gameObjects/ui'

// add composite placed tiles
// improve rng by shuffling full sets
// extra life every 25 loops
// score multiplier
// add tile holding
// sounds
// fancy effects on placing/clearing tiles
// title graphic
// add credits

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init(opts) {}

  create() {
    this.map = new Map(this)
    this.ui = new UI(this)

    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE')
    this.keys.W.on('down', () => this.move('up'))
    this.keys.A.on('down', () => this.move('left'))
    this.keys.S.on('down', () => this.move('down'))
    this.keys.D.on('down', () => this.move('right'))
    this.keys.SPACE.on('down', this.placeTile.bind(this))

    this.time.addEvent({
      delay: 100,
      repeat: -1,
      callback: this.updateTimer.bind(this),
    })
  }

  move(direction) {
    this.ui.moveMarker(direction)
  }

  placeTile() {
    const { x, y, frame } = this.ui.marker
    if (this.map.placeTile(x, y, frame.name)) {
      const loop = this.map.getLoop()
      if (loop) {
        this.map.clearTiles(loop)
        this.ui.updateLoops(1)
        this.ui.updateScore(loop.length * 100)
      }
      this.ui.getNewTile()
    }
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
