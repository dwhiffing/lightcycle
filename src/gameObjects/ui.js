import { TIME_DURATION, Y_OFFSET } from '../constants'

export default class {
  constructor(scene) {
    this.scene = scene
    // TODO: Timer should be defined in game, ui should just render it?
    this.timer = TIME_DURATION

    // TODO: Timer should be set in game?
    this.scene.registry.set('score', 0)
    this.scene.registry.set('lives', 3)
    this.scene.registry.set('multi', 1)

    this._drawInterface()

    // TODO: make text game object
    this.livesText = this._getText(
      63,
      Y_OFFSET + 2,
      this.scene.registry.get('lives'),
    )
    this.multiText = this._getText(
      57,
      Y_OFFSET + 2,
      this.scene.registry.get('multi'),
    )
    this.scoreText = this._getText(46, Y_OFFSET + 2, 0)
  }

  updateScore = (score) => {
    const multi = this.scene.registry.get('multi')
    const newScore = +this.scene.registry.get('score') + score * multi

    this.scene.registry.set('score', `${newScore}`)
    // TODO: extra lives every x points
    // if (this.scene.registry.get('loops') % 25 === 0) {
    //   this.updateLives(1)
    // }

    this.scene.registry.set('multi', this._getMulti())
    this.multiText.setText(this.scene.registry.get('multi'))
    this.scoreText.setText(this.scene.registry.get('score'))
  }

  updateLives = (lives) => {
    this.scene.registry.set(
      'lives',
      Math.min(10, this.scene.registry.get('lives') + lives),
    )
    this.livesText.setText(this.scene.registry.get('lives'))
  }

  renderTimer = () => {
    this.timerBar.clear()
    const percent =
      this.timer /
      (TIME_DURATION - (this.scene.registry.get('multi') - 1) * 600)
    this.timerBar.fillRect(
      0,
      Y_OFFSET - Math.round(Y_OFFSET * percent),
      64,
      Math.round(Y_OFFSET * percent),
    )
  }

  tickTimer = () => {
    this.timer -= 100
    this.renderTimer()
  }

  setNextTileGraphics = (nextTile, rotationIndex) => {
    // TODO: refactor these
    this._setTileGraphics(
      this.nextTileGraphics,
      2,
      Y_OFFSET + 2,
      nextTile[Math.min(rotationIndex, nextTile.length - 1)],
    )
  }

  setHoldTileGraphics = (heldTile, rotationIndex) => {
    // TODO: refactor these
    this._setTileGraphics(
      this.heldTileGraphics,
      10,
      Y_OFFSET + 2,
      heldTile[Math.min(rotationIndex, heldTile.length - 1)],
    )
  }

  _setTileGraphics = (graphics, x, y, frames) => {
    graphics.clear()
    frames.forEach((frame, index) => {
      if (frame <= 1) return
      const _x = x + (index % 3) * 2
      const _y = y + Math.floor(index / 3) * 2
      graphics.fillRect(_x, _y, 1, 1)
    })
  }

  _getText = (x, y, string) =>
    this.scene.add.bitmapText(x, y, 'pixel-dan', string, 5).setOrigin(1, 0)

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

  _getMulti = () => {
    const score = this.scene.registry.get('score')
    if (score < 1000) return 1
    if (score < 5000) return 2
    if (score < 10000) return 3
    if (score < 20000) return 4
    if (score < 40000) return 5
    if (score < 80000) return 6
    if (score < 100000) return 7
    if (score < 200000) return 8
    return 9
  }
}
