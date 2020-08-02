// improve rng by shuffling full sets
// add tile holding
// add composite placed tiles
// add score/timer
// add cross/3 way tile? (seems too complicated for loop checking)
import Map from '../gameObjects/map'
import UI from '../gameObjects/ui'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init(opts) {}

  create() {
    this.tileIndex = 2

    this.map = new Map(this)
    this.ui = new UI(this)

    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE')
    this.keys.SPACE.on('down', this.ui.placeTile)
    this.keys.W.on('down', () => this.ui.moveMarker('up'))
    this.keys.A.on('down', () => this.ui.moveMarker('left'))
    this.keys.S.on('down', () => this.ui.moveMarker('down'))
    this.keys.D.on('down', () => this.ui.moveMarker('right'))
  }

  update() {}
}
