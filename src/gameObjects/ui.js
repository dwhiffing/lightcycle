import { UI_Y_POS } from '../constants'

export default class {
  constructor(scene) {
    this.scene = scene
    this.data = scene.data
    this.data.events.on('changedata', this.update)

    this._drawInterface()

    const lives = this.data.get('lives')
    const multi = this.data.get('multi')
    const score = this.data.get('score')

    this.livesText = this._getText(63, UI_Y_POS + 2, lives)
    this.multiText = this._getText(57, UI_Y_POS + 2, multi)
    this.scoreText = this._getText(46, UI_Y_POS + 2, score)

    // TODO: point text should update as tiles disappear from match
    this.pointText = this._getText(32, 32, `20`)
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(10)
  }

  update = () => {
    const {
      lives,
      score,
      multi,
      timer,
      timerMax,
      nextMino,
      heldMino,
    } = this.data.getAll()

    if (this.pointText.alpha > 0) {
      this.pointText.alpha -= 0.01
    }

    this.multiText.setText(multi)
    this.scoreText.setText(score)
    this.livesText.setText(lives)

    this.timerBar.clear()
    const percent = timer / timerMax
    const rounded = Math.round(UI_Y_POS * percent)
    this.timerBar
      .fillStyle(
        this.scene.bgColor.color,
        Phaser.Math.Clamp(1 - percent, 0.2, 1),
      )
      .fillRect(0, UI_Y_POS - rounded, 64, rounded)

    nextMino &&
      this._renderMino(this.nextMinoGraphics, 2, UI_Y_POS + 2, nextMino)
    heldMino &&
      this._renderMino(this.heldMinoGraphics, 10, UI_Y_POS + 2, heldMino)
  }

  setPointText = (score) => {
    this.pointText.setScale(2).setOrigin(0.5)
    this.pointText.x = 40
    this.pointText.y = 32
    this.pointText.alpha = 0.5
    this.pointText.setText(score)
    this.pointText.setTint(this.scene.bgColor.clone().brighten(20).color)
  }

  _getText = (x, y, string) =>
    this.scene.add
      .bitmapText(x, y, 'pixel-dan', string, 5)
      .setOrigin(1, 0)
      .setDepth(3)

  _renderMino = (graphics, x, y, frames) => {
    graphics.clear()
    frames.forEach((frame, index) => {
      if (frame <= 1) return
      const _x = x + (index % 3) * 2
      const _y = y + Math.floor(index / 3) * 2
      graphics.fillRect(_x, _y, 1, 1)
    })
  }

  _drawInterface = () => {
    this.uiGraphics = this.scene.add
      .graphics()
      .setDepth(1)
      // draw frame
      .fillStyle(0xffffff, 0.25)
      .fillRect(0, UI_Y_POS, 64, 13)
      // draw boxes
      .fillStyle(0x000000)
      // next tile box
      .fillRect(1, UI_Y_POS + 1, 7, 7)
      // held tile box
      .fillRect(9, UI_Y_POS + 1, 7, 7)
      // score tile box
      .fillRect(17, UI_Y_POS + 1, 29, 7)
      // multi box
      .fillRect(47, UI_Y_POS + 1, 10, 7)
      // lives box
      .fillRect(58, UI_Y_POS + 1, 5, 7)
      // draw multiplier x
      .fillStyle(0xffffff)
      .fillRect(49, UI_Y_POS + 5, 1, 1)
      .fillRect(48, UI_Y_POS + 4, 1, 1)
      .fillRect(48, UI_Y_POS + 6, 1, 1)
      .fillRect(50, UI_Y_POS + 4, 1, 1)
      .fillRect(50, UI_Y_POS + 6, 1, 1)

    this.timerBar = this.scene.add.graphics().fillStyle(0xffffff, 1).setDepth(2)

    this.nextMinoGraphics = this.scene.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .setDepth(1)
    this.heldMinoGraphics = this.scene.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .setDepth(1)
  }
}
