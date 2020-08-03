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
