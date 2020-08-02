const TIME_DURATION = 10000

export default class {
  constructor(scene) {
    this.scene = scene
    this.moveTimer = 0
    this.moveMarker = this.moveMarker.bind(this)
    this.tickTimer = this.tickTimer.bind(this)
    this.data = this.scene.registry
    this.timer = TIME_DURATION

    this.data.set('score', 0)
    this.data.set('lives', 3)
    this.data.set('loops', 0)
    this.data.set('multi', 1)

    this.drawInterface()

    this.pickedTileCounter = 0
    this.marker = this.scene.add
      .sprite(2, 0, 'tiles', 0)
      .setOrigin(0, 0)
      .setFrame(0)
      .setTint(0x44cc44)
    this.getNewTile()

    this.livesText = this.getText(7, 53, this.data.get('lives'))
    this.loopText = this.getText(23, 53, this.data.get('loops'))
    this.multiText = this.getText(35, 53, this.data.get('multi'))
    this.scoreText = this.getText(62, 53, this.data.get('score'))
  }

  updateScore(score) {
    this.data.set('score', this.data.get('score') + score)
    this.scoreText.setText(this.data.get('score'))
  }

  updateLives(lives) {
    this.data.set('lives', this.data.get('lives') + lives)
    this.livesText.setText(this.data.get('lives'))
  }

  updateMulti(multi) {
    this.data.set('multi', this.data.get('multi') + multi)
    this.multiText.setText(this.data.get('multi'))
  }

  updateLoops(loops) {
    this.data.set('loops', this.data.get('loops') + loops)
    this.loopText.setText(this.data.get('loops'))
  }

  tickTimer() {
    this.timer -= 100
    this.updateTimer()
  }

  updateTimer() {
    this.timerBar.clear()
    const percent = this.timer / TIME_DURATION
    this.timerBar.fillRect(1, 60, 62 * percent, 3)
  }

  moveMarker(direction) {
    if (direction === 'up') {
      this.marker.y -= this.marker.y < 3 ? 0 : 5
    } else if (direction === 'left') {
      this.marker.x -= this.marker.x < 3 ? 0 : 5
    } else if (direction === 'down') {
      this.marker.y += this.marker.y > 40 ? 0 : 5
    } else if (direction === 'right') {
      this.marker.x += this.marker.x > 53 ? 0 : 5
    }
  }

  getNewTile() {
    // const newIndex = Phaser.Math.RND.between(2, 7)
    this.timer = TIME_DURATION
    this.updateTimer()
    const newIndex = TILE_ORDER[this.pickedTileCounter % TILE_ORDER.length]
    this.marker.setFrame(newIndex)
    this.pickedTileCounter++
  }

  drawInterface() {
    this.uiGraphics = this.scene.add
      .graphics()
      .fillStyle(0xffffff, 0.25)
      .fillRect(0, 51, 64, 13)
      .fillStyle(0x000000)
      .fillRect(1, 52, 7, 7)
      .fillRect(9, 52, 15, 7)
      .fillRect(25, 52, 10, 7)
      .fillRect(36, 52, 27, 7)
      .fillRect(1, 60, 62, 3)
      .fillStyle(0xffffff)
      .fillRect(27, 56, 1, 1)
      .fillRect(26, 55, 1, 1)
      .fillRect(26, 57, 1, 1)
      .fillRect(28, 55, 1, 1)
      .fillRect(28, 57, 1, 1)

    this.timerBar = this.scene.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRect(1, 60, 62, 3)
  }

  getText(x, y, string) {
    return this.scene.add
      .bitmapText(x, y, 'pixel-dan', string, 5)
      .setOrigin(1, 0)
  }
}

const TILE_ORDER = [4, 6, 5, 7, 2, 2, 2, 3, 3, 3]
