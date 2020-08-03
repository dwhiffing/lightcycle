import { TIME_DURATION, Y_OFFSET } from '../constants'

export default class {
  constructor(scene) {
    this.scene = scene
    this.moveTimer = 0
    this.tickTimer = this.tickTimer.bind(this)
    this.setNextTileGraphics = this.setNextTileGraphics.bind(this)
    this.setHoldTileGraphics = this.setHoldTileGraphics.bind(this)
    this.setTileGraphics = this.setTileGraphics.bind(this)
    this.data = this.scene.registry
    this.timer = TIME_DURATION

    this.data.set('score', 0)
    this.data.set('lives', 3)
    this.data.set('multi', 1)

    this.drawInterface()

    this.livesText = this.getText(63, Y_OFFSET + 2, this.data.get('lives'))
    this.multiText = this.getText(57, Y_OFFSET + 2, this.data.get('multi'))
    this.scoreText = this.getText(46, Y_OFFSET + 2, 0)
  }

  updateScore(score) {
    const multi = this.data.get('multi')
    const newScore = +this.data.get('score') + score * multi

    this.data.set('score', `${newScore}`)
    // TODO: extra lives every x points
    // if (this.data.get('loops') % 25 === 0) {
    //   this.updateLives(1)
    // }

    this.data.set('multi', this.getMulti())
    this.multiText.setText(this.data.get('multi'))
    this.scoreText.setText(this.data.get('score'))
  }

  updateLives(lives) {
    this.data.set('lives', Math.min(10, this.data.get('lives') + lives))
    this.livesText.setText(this.data.get('lives'))
  }

  updateTimer() {
    this.timerBar.clear()
    const percent =
      this.timer / (TIME_DURATION - (this.data.get('multi') - 1) * 600)
    this.timerBar.fillRect(
      0,
      Y_OFFSET - Math.round(Y_OFFSET * percent),
      64,
      Math.round(Y_OFFSET * percent),
    )
  }

  tickTimer() {
    this.timer -= 100
    this.updateTimer()
  }

  drawInterface() {
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

  setNextTileGraphics(nextTile, rotationIndex) {
    this.setTileGraphics(
      this.nextTileGraphics,
      2,
      Y_OFFSET + 2,
      nextTile[Math.min(rotationIndex, nextTile.length - 1)],
    )
  }

  setHoldTileGraphics(heldTile, rotationIndex) {
    this.setTileGraphics(
      this.heldTileGraphics,
      10,
      Y_OFFSET + 2,
      heldTile[Math.min(rotationIndex, heldTile.length - 1)],
    )
  }

  setTileGraphics(graphics, x, y, frames) {
    graphics.clear()
    frames.forEach((frame, index) => {
      if (frame <= 1) return

      graphics.fillRect(
        x + (index % 3) * 2,
        y + Math.floor(index / 3) * 2,
        1,
        1,
      )
    })
  }

  getText(x, y, string) {
    return this.scene.add
      .bitmapText(x, y, 'pixel-dan', string, 5)
      .setOrigin(1, 0)
  }

  getMulti() {
    const score = this.data.get('score')
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
