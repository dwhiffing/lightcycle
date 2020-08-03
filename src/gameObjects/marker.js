import { LEVELS, SMALL_LINE, TIME_DURATION } from '../constants'

export default class {
  constructor(scene) {
    this.scene = scene
    this.upcomingTypes = [SMALL_LINE]
    this.container = this.scene.add.container(7, 5)
    this.getNewTile()
  }

  move = (direction) => {
    if (direction === 'up') {
      this.container.y -= this.container.y < -2 ? 0 : 5
    } else if (direction === 'left') {
      this.container.x -= this.container.x < -2 ? 0 : 5
    } else if (direction === 'down') {
      this.container.y += this.container.y > 40 ? 0 : 5
    } else if (direction === 'right') {
      this.container.x += this.container.x > 53 ? 0 : 5
    }

    this._render()
  }
  moveUp = () => this.move('up')
  moveLeft = () => this.move('left')
  moveRight = () => this.move('right')
  moveDown = () => this.move('down')

  rotate = (direction) => {
    this.rotationIndex += direction
    if (this.rotationIndex < 0) {
      this.rotationIndex = this.containerLayout.length - 1
    }
    if (this.rotationIndex > this.containerLayout.length - 1) {
      this.rotationIndex = 0
    }
    this._render()
  }
  rotateLeft = () => this.rotate(-1)
  rotateRight = () => this.rotate(1)

  hold = () => {
    if (!this.canHold) return

    if (this.heldTile) {
      let temp = this.containerLayout
      this.containerLayout = this.heldTile
      this.heldTile = temp
      this._render()
    } else {
      this.heldTile = this.containerLayout
      this.getNewTile()
    }

    this.canHold = false

    // TODO: move elsewhere?
    this.scene.ui.setHoldTileGraphics(this.heldTile, this.rotationIndex)
  }

  getNewTile = () => {
    this.canHold = true
    this.containerLayout = this.upcomingTypes.shift()
    if (this.upcomingTypes.length === 0) {
      const types = Phaser.Math.RND.shuffle([
        ...LEVELS[this.scene.registry.get('multi') - 1],
      ])
      this.upcomingTypes = types.map((types) =>
        Phaser.Math.RND.weightedPick(types),
      )
    }
    this.rotationIndex = Phaser.Math.RND.between(
      0,
      this.containerLayout.length - 1,
    )

    this._render()

    // TODO: move elsewhere?
    this.scene.ui.setNextTileGraphics(this.upcomingTypes[0], this.rotationIndex)
    this.scene.ui.timer =
      TIME_DURATION - (this.scene.registry.get('multi') - 1) * 600
    this.scene.ui.renderTimer()
  }

  canPlaceTiles = () =>
    this._getTiles().every(
      ({ x, y, frame }) =>
        frame === -1 || this.scene.map.getTile(x, y).index < 2,
    )

  placeTiles = () => {
    this._getTiles().forEach(({ x, y, frame }) => {
      if (frame > -1) this.scene.map.placeTile(x, y, frame)
    })
  }

  _getTiles = () => {
    const { x: _x, y: _y } = this.container
    return this.layout.map((frame, index) => {
      const x = (_x - 2) / 5 + (index % 3)
      const y = _y / 5 + window.Math.floor(index / 3)
      return { x, y, frame }
    })
  }

  _render = () => {
    this.container.remove(this.container.list, true)
    this.layout = this.containerLayout[
      Math.min(this.rotationIndex, this.containerLayout.length - 1)
    ]
    this.layout.forEach((frame, index) => {
      const x = 5 * (index % 3)
      const y = 5 * window.Math.floor(index / 3)

      if (frame > -1) {
        const tile = this.scene.add
          .sprite(x, y, 'tiles', frame)
          .setOrigin(0, 0)
          .setTint(0x44cc44)
        tile.__index = index
        this.container.add(tile)
      }
    })

    // TODO: fix tinting
    this._getTiles().forEach(({ x, y }, index) => {
      const tile = this.scene.map.getTile(x, y)
      const sprite = this.container.list.find((tile) => tile.__index === index)
      sprite && sprite.setTint(tile.index > 1 ? 0xcc4444 : 0x44cc44)
    })
  }
}
