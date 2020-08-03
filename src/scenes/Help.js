export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Help' })
  }

  init(opts) {
    this.input.keyboard.removeAllKeys(true)
    this.keys = this.input.keyboard.addKeys('SPACE')
    this.keys.SPACE.on('down', this.back)
  }

  create() {
    this.add.bitmapText(32, 10, 'pixel-dan', 'HELP', 5).setOrigin(0.5)
    this.add.bitmapText(32, 55, 'pixel-dan', 'PRESS SPACE', 5).setOrigin(0.5)
  }

  back = () => {
    this.scene.start('Menu')
  }

  update() {}
}
