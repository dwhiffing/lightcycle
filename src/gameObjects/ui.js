export default class {
  constructor(scene) {
    this.moveTimer = 0
    this.tileIndex = 2
    this.scene = scene
    this.moveMarker = this.moveMarker.bind(this)
    this.placeTile = this.placeTile.bind(this)

    this.drawInterface()

    this.marker = scene.add
      .sprite(2, 0, 'tiles', 0)
      .setOrigin(0, 0)
      .setFrame(this.tileIndex)
      .setTint(0x44cc44)

    this.livesText = this.getText(7, 53, '2')
    this.loopCountText = this.getText(23, 53, '999')
    this.multiplyerText = this.getText(35, 53, '9')
    this.scoreText = this.getText(62, 53, '999999')
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

  placeTile() {
    const tiledPlaced = this.scene.map.placeTile(
      this.marker.x,
      this.marker.y,
      this.tileIndex,
    )
    if (tiledPlaced) {
      this.tileIndex = Phaser.Math.RND.between(2, 7)
      this.marker.setFrame(this.tileIndex)
    }
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

    // this.graphics.fillRect(0, 51, 1, 15)
    // this.graphics.fillRect(63, 51, 1, 15)

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
