export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' })
  }

  init(opts) {
    this.input.keyboard.removeAllKeys(true)
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,UP,DOWN')
    this.keys.SPACE.on('down', this.selectOption)
    this.keys.W.on('down', this.lastOption)
    this.keys.S.on('down', this.nextOption)
    this.keys.UP.on('down', this.lastOption)
    this.keys.DOWN.on('down', this.nextOption)

    this.optionIndex = 0
  }

  create() {
    this.add.bitmapText(32, 10, 'pixel-dan', 'LOOPZ', 5).setOrigin(0.5)

    this.add.bitmapText(32, 37, 'pixel-dan', 'START', 5).setOrigin(0.5)
    this.add.bitmapText(32, 45, 'pixel-dan', 'HELP', 5).setOrigin(0.5)
    this.spaceText = this.add
      .bitmapText(32, 59, 'pixel-dan', 'PRESS SPACE', 5)
      .setOrigin(0.5)

    this.arrow = this.add.graphics()
    this.arrow.fillStyle(0xffffff)

    this.nextOption()

    const score = this.registry.get('score')
    if (score) {
      this.nextOption()

      this.add
        .bitmapText(32, 25, 'pixel-dan', `SCORE ${score}`, 5)
        .setOrigin(0.5)
    }

    this.time.addEvent({
      repeat: -1,
      delay: 1000,
      callback: () => {
        this.spaceText.setAlpha(this.spaceText.alpha === 0.6 ? 1 : 0.6)
      },
    })
  }

  lastOption = () => this.setOption(this.optionIndex--)

  nextOption = () => this.setOption(this.optionIndex++)

  setOption = () => {
    this.arrow.clear()
    if (this.optionIndex < 0) this.optionIndex = 1
    if (this.optionIndex > 1) this.optionIndex = 0
    this.arrow
      .fillRect(17, 35 + 8 * this.optionIndex, 2, 3)
      .fillRect(19, 36 + 8 * this.optionIndex, 1, 1)
  }

  selectOption = () => {
    if (this.optionIndex === 0) {
      this.scene.start('Game')
    }
    if (this.optionIndex === 1) {
      this.scene.start('Help')
    }
  }

  update() {}
}
