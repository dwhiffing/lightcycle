import Background from '../gameObjects/background'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Help' })
  }

  init(data) {
    this.colorIndex = data.startIndex
  }

  create() {
    new Background(this, this.colorIndex)

    this.input.keyboard.removeAllKeys(true)
    this.keys = this.input.keyboard.addKeys('SPACE')
    this.keys.SPACE.on('down', this.next)
    this.game.events.on('a-button', this.next)
    this.game.events.on('b-button', this.back)

    this.textIndex = 0
    this.mainText = this.add
      .bitmapText(32, 27, 'pixel-dan', TEXTS[0], 5)
      .setCenterAlign()
      .setOrigin(0.5)

    // this.space = this.add
    //   .bitmapText(32, 59, 'pixel-dan', 'PRESS SPACE', 5)
    //   .setOrigin(0.5)
    //   .setAlpha(0.25)
    this.sprites = []
  }

  next = () => {
    this.sprites.forEach((s) => s.destroy())
    this.sprites = []
    this.textIndex++
    if (this.textIndex < TEXTS.length) {
      const text = TEXTS[this.textIndex]
      this.mainText.setText(text)
      if (text.match(/NEXT PIECE|MULTIPLIER|LIVES/)) {
        this.sprites.push(this.add.sprite(0, 64, 'hud').setOrigin(0, 1))
      }
      if (text.includes('PARTIAL')) {
        this.sprites.push(this.add.sprite(32, 45, 'tiles', 8).setOrigin(0.5, 1))
      }
    } else {
      this.back()
    }
  }

  back = () => {
    this.game.events.off('a-button', this.next)
    this.game.events.off('b-button', this.back)
    this.registry.set('inHelp', false)
    this.scene.stop()
  }

  update() {}
}
const isMobile = window.innerWidth < 800
const TEXTS = [
  `PLACE TILES TO
CONNECT THEM IN
LOOPS TO SCORE`,

  `PLACE BEFORE
THE TIMER ENDS
OR LOSE A LIFE`,

  `COMPLEX LOOPS
WILL GIVE YOU
MORE POINTS`,

  `CONTROLS

${isMobile ? 'DPAD' : 'ARROWS OR WASD'}
MOVE TILE`,
  `${isMobile ? 'A BUTTON' : 'SPACE'}
PLACE TILE

${isMobile ? 'B BUTTON' : 'QE OR ZX'}
ROTATE TILE`,
  `
${isMobile ? 'HOLD B BUTTON' : 'C OR R'}
SWAP OR HOLD
TILE

M
TOGGLE MUTE
`,
  `1
NEXT PIECE

2
HELD PIECE`,
  `3
SCORE

4
MULTIPLIER`,
  `5
LIVES`,

  `THIS TILE WILL
  CLEAR A PARTIAL
  LOOP FOR YOU`,

  `YOU WILL GAIN
AN EXTRA LIFE
FOR EVERY 10000
POINTS YOU SCORE`,

  `MAKE MANY LOOPS
ON THE BOARD
SIMULTANEOUSLY
`,

  `CREATED BY

DANIEL
WHIFFING`,

  `BASED ON LOOPZ BY

MINDSCAPE`,
]
