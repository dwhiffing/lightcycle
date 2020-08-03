const TEXTS = [
  'WELCOME TO LOOPZ',
  `IN THIS GAME YOU
MUST MAKE LOOPZ
BY PLACING TILES
ON THE BOARD IN
STRATEGIC PLACES.
YOU CAN DO IT!
I BELIEVE IN YOU.
YOU DID IT
`,
  'BY DAN WHIFFING',
]

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Help' })
  }

  init() {
    this.input.keyboard.removeAllKeys(true)
    this.keys = this.input.keyboard.addKeys('SPACE')
    this.keys.SPACE.on('down', this.next)
  }

  create() {
    this.textIndex = 0
    this.mainText = this.add
      .bitmapText(32, 28, 'pixel-dan', TEXTS[0], 5)
      .setCenterAlign()
      .setOrigin(0.5)
    this.add.bitmapText(32, 59, 'pixel-dan', 'PRESS SPACE', 5).setOrigin(0.5)
  }

  next = () => {
    this.textIndex++
    if (this.textIndex < TEXTS.length) {
      this.mainText.setText(TEXTS[this.textIndex])
    } else {
      this.scene.start('Menu')
    }
  }

  update() {}
}
