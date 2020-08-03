import { LEVELS, SMALL_LINE } from '../constants'

const TIME_DURATION = 10000

export default class {
  constructor(scene) {
    this.scene = scene
    this.moveTimer = 0
    this.moveMarker = this.moveMarker.bind(this)
    this.tickTimer = this.tickTimer.bind(this)
    this.getMarkerTiles = this.getMarkerTiles.bind(this)
    this.data = this.scene.registry
    this.timer = TIME_DURATION
    this.upcomingTypes = [SMALL_LINE]

    this.data.set('score', 0)
    this.data.set('lives', 3)
    this.data.set('multi', 1)

    this.drawInterface()

    this.pickedTileCounter = 0
    this.marker = this.scene.add.container(7, 5)

    this.livesText = this.getText(63, 53, this.data.get('lives'))
    this.multiText = this.getText(57, 53, this.data.get('multi'))
    this.scoreText = this.getText(46, 53, 0)

    this.getNewTile()
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

  moveMarker(direction) {
    if (direction === 'up') {
      this.marker.y -= this.marker.y < -2 ? 0 : 5
    } else if (direction === 'left') {
      this.marker.x -= this.marker.x < -2 ? 0 : 5
    } else if (direction === 'down') {
      this.marker.y += this.marker.y > 40 ? 0 : 5
    } else if (direction === 'right') {
      this.marker.x += this.marker.x > 53 ? 0 : 5
    }

    this.updateMarker()
  }

  getMarkerTiles() {
    const { x, y } = this.marker
    return this.marker.frames.map((frame, index) => {
      const _x = (x - 2) / 5 + (index % 3)
      const _y = y / 5 + window.Math.floor(index / 3)
      if (frame === -1) return -1
      return this.scene.map.map.getTileAt(_x, _y, frame)
    })
  }

  rotateMarker(direction) {
    this.rotationIndex += direction
    if (this.rotationIndex < 0) {
      this.rotationIndex = this.markerLayout.length - 1
    }
    if (this.rotationIndex > this.markerLayout.length - 1) {
      this.rotationIndex = 0
    }
    this.updateMarker()
  }

  hold() {
    if (!this.canHold) return

    if (this.heldTile) {
      let temp = this.markerLayout
      this.markerLayout = this.heldTile
      this.heldTile = temp
      this.updateMarker()
    } else {
      this.heldTile = this.markerLayout
      this.getNewTile()
    }

    this.canHold = false
    this.setHoldTileGraphics()
  }

  getNewTile() {
    this.canHold = true
    this.markerLayout = this.upcomingTypes.shift()
    if (this.upcomingTypes.length === 0) {
      const types = Phaser.Math.RND.shuffle([
        ...LEVELS[this.data.get('multi') - 1],
      ])
      this.upcomingTypes = types.map((types) =>
        Phaser.Math.RND.weightedPick(types),
      )
    }
    this.rotationIndex = Phaser.Math.RND.between(
      0,
      this.markerLayout.length - 1,
    )

    this.updateMarker()
    this.setNextTileGraphic()

    this.timer = TIME_DURATION - (this.data.get('multi') - 1) * 600
    this.updateTimer()
    this.pickedTileCounter++
  }

  updateTimer() {
    this.timerBar.clear()
    const percent =
      this.timer / (TIME_DURATION - (this.data.get('multi') - 1) * 600)
    this.timerBar.fillRect(1, 60, 62 * percent, 3)
  }

  tickTimer() {
    this.timer -= 100
    this.updateTimer()
  }

  updateMarker() {
    this.marker.remove(this.marker.list, true)
    this.marker.frames = this.markerLayout[
      Math.min(this.rotationIndex, this.markerLayout.length - 1)
    ]
    this.marker.frames.forEach((frame, index) => {
      const x = 5 * (index % 3)
      const y = 5 * window.Math.floor(index / 3)

      if (frame > -1) {
        const tile = this.scene.add
          .sprite(x, y, 'tiles', frame)
          .setOrigin(0, 0)
          .setTint(0x44cc44)
        tile.__index = index
        this.marker.add(tile)
      }
    })

    this.getMarkerTiles().forEach((tile, index) => {
      if (typeof tile !== 'number') {
        const frame = this.marker.list.find((tile) => tile.__index === index)
        frame && frame.setTint(tile && tile.index > 1 ? 0xcc4444 : 0x44cc44)
      }
    })
  }

  drawInterface() {
    this.uiGraphics = this.scene.add
      .graphics()
      .fillStyle(0xffffff, 0.25)
      .fillRect(0, 51, 64, 13)
      .fillStyle(0x000000)
      .fillRect(1, 52, 7, 7)
      .fillRect(9, 52, 7, 7)
      .fillRect(17, 52, 29, 7)
      .fillRect(47, 52, 10, 7)
      .fillRect(58, 52, 5, 7)
      .fillRect(1, 60, 62, 3)
      .fillStyle(0xffffff)
      .fillRect(49, 56, 1, 1)
      .fillRect(48, 55, 1, 1)
      .fillRect(48, 57, 1, 1)
      .fillRect(50, 55, 1, 1)
      .fillRect(50, 57, 1, 1)

    this.timerBar = this.scene.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRect(1, 60, 62, 3)

    this.nextTileGraphics = this.scene.add.graphics().fillStyle(0xffffff, 1)
    this.heldTileGraphics = this.scene.add.graphics().fillStyle(0xffffff, 1)
  }

  setNextTileGraphic() {
    this.setTileGraphics(
      this.nextTileGraphics,
      2,
      53,
      this.upcomingTypes[0][
        Math.min(this.rotationIndex, this.upcomingTypes[0].length - 1)
      ],
    )
  }

  setHoldTileGraphics() {
    this.setTileGraphics(
      this.heldTileGraphics,
      10,
      53,
      this.heldTile[Math.min(this.rotationIndex, this.heldTile.length - 1)],
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
