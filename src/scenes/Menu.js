export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' })
  }

  init(opts) {
    this.input.keyboard.removeAllKeys(true)
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE')
    this.keys.SPACE.on('down', this.startGame.bind(this))
  }

  create() {
    // this.keys.W.on('down', () => this.move('up'))
    // this.keys.A.on('down', () => this.move('left'))
    // this.keys.S.on('down', () => this.move('down'))
    // this.keys.D.on('down', () => this.move('right'))
    this.add.bitmapText(32, 10, 'pixel-dan', 'LOOPZ', 5).setOrigin(0.5)
    this.add.bitmapText(32, 55, 'pixel-dan', 'PRESS SPACE', 5).setOrigin(0.5)

    const score = this.registry.get('score')
    score &&
      this.add
        .bitmapText(32, 32, 'pixel-dan', `SCORE ${score}`, 5)
        .setOrigin(0.5)
  }

  startGame() {
    this.scene.start('Game')
  }

  update() {}
}
