import { TIME_DURATION, Y_OFFSET, SCORES } from '../constants'

export default class {
  constructor(scene) {
    this.scene = scene
    this.timer = TIME_DURATION

    this._drawInterface()

    const lives = this.scene.registry.get('lives')
    const multi = this.scene.registry.get('multi')
    const score = this.scene.registry.get('score')

    // TODO: make text game object
    this.livesText = this._getText(63, Y_OFFSET + 2, lives)
    this.multiText = this._getText(57, Y_OFFSET + 2, multi)
    this.scoreText = this._getText(46, Y_OFFSET + 2, score)
  }

  updateScore = (score) => {
    const multi = this.scene.registry.get('multi')
    const newScore = +this.scene.registry.get('score') + score * multi

    this.scene.registry.set('score', `${newScore}`)
    this.scene.registry.set('multi', this._getMulti())

    // TODO: extra lives every x points
    // if (this.scene.registry.get('loops') % 25 === 0) {
    //   this.updateLives(1)
    // }

    this.multiText.setText(this.scene.registry.get('multi'))
    this.scoreText.setText(this.scene.registry.get('score'))
  }

  updateLives = (value) => {
    const lives = this.scene.registry.get('lives')
    this.scene.registry.set('lives', Math.min(10, lives + value))
    this.livesText.setText(lives)
  }

  renderTimer = () => {
    this.timerBar.clear()
    const percent = this.timer / this._getTimerMax()
    const rounded = Math.round(Y_OFFSET * percent)
    this.timerBar.fillRect(0, Y_OFFSET - rounded, 64, rounded)
  }

  resetTimer = () => {
    this.timer = this._getTimerMax()
    this.renderTimer()
  }

  renderNextMino = (nextTile) => {
    this._setTileGraphics(this.nextTileGraphics, 2, Y_OFFSET + 2, nextTile)
  }

  renderHeldMino = (heldTile) => {
    this._setTileGraphics(this.heldTileGraphics, 10, Y_OFFSET + 2, heldTile)
  }

  _getTimerMax = () =>
    TIME_DURATION - (this.scene.registry.get('multi') - 1) * 600

  _getText = (x, y, string) =>
    this.scene.add.bitmapText(x, y, 'pixel-dan', string, 5).setOrigin(1, 0)

  _setTileGraphics = (graphics, x, y, frames) => {
    graphics.clear()
    frames.forEach((frame, index) => {
      if (frame <= 1) return
      const _x = x + (index % 3) * 2
      const _y = y + Math.floor(index / 3) * 2
      graphics.fillRect(_x, _y, 1, 1)
    })
  }

  _getMulti = () => {
    const score = this.scene.registry.get('score')
    for (let key in SCORES) {
      if (score < key) return SCORES[key]
    }
    return 9
  }

  _drawInterface = () => {
    this.uiGraphics = this.scene.add
      .graphics()
      .fillStyle(0xffffff, 0.25)
      .fillRect(0, Y_OFFSET, 64, 13)
      .fillStyle(0x000000)
      .fillRect(1, Y_OFFSET + 1, 7, 7)
      .fillRect(9, Y_OFFSET + 1, 7, 7)
      .fillRect(17, Y_OFFSET + 1, 29, 7)
      .fillRect(47, Y_OFFSET + 1, 10, 7)
      .fillRect(58, Y_OFFSET + 1, 5, 7)
      .fillRect(1, Y_OFFSET + 9, 62, 3)
      .fillStyle(0xffffff)
      .fillRect(49, Y_OFFSET + 5, 1, 1)
      .fillRect(48, Y_OFFSET + 4, 1, 1)
      .fillRect(48, Y_OFFSET + 6, 1, 1)
      .fillRect(50, Y_OFFSET + 4, 1, 1)
      .fillRect(50, Y_OFFSET + 6, 1, 1)

    this.timerBar = this.scene.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .setDepth(-1)

    this.nextTileGraphics = this.scene.add.graphics().fillStyle(0xffffff, 1)
    this.heldTileGraphics = this.scene.add.graphics().fillStyle(0xffffff, 1)
  }
}
