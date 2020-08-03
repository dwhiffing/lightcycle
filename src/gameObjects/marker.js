import { LEVELS, SMALL_LINE } from '../constants'

export default class {
  constructor(scene) {
    this.scene = scene
    this.upcomingMinos = [SMALL_LINE]
    this.container = this.scene.add.container(7, 5)
    this.getNextMino()
  }

  moveUp = () => this.move(0)
  moveLeft = () => this.move(3)
  moveRight = () => this.move(1)
  moveDown = () => this.move(2)

  rotateLeft = () => this.rotate(-1)
  rotateRight = () => this.rotate(1)

  hold = () => {
    if (!this.canHold) return

    if (this.heldMino) {
      let temp = this.mino
      this.mino = this.heldMino
      this.heldMino = temp
      this._render()
    } else {
      this.heldMino = this.mino
      this.getNextMino()
    }

    this.canHold = false
    this.scene.data.set('heldMino', this._getMinoFrames(this.heldMino))
  }

  move = (direction) => {
    if (direction === 0) {
      this.container.y -= this.container.y < -2 ? 0 : 5
    } else if (direction === 3) {
      this.container.x -= this.container.x < -2 ? 0 : 5
    } else if (direction === 2) {
      this.container.y += this.container.y > 40 ? 0 : 5
    } else if (direction === 1) {
      this.container.x += this.container.x > 53 ? 0 : 5
    }

    this._render()
  }

  rotate = (direction) => {
    this.rotation += direction
    if (this.rotation < 0) {
      this.rotation = this.mino.length - 1
    }
    if (this.rotation > this.mino.length - 1) {
      this.rotation = 0
    }
    this._render()
  }

  getNextMino = () => {
    this.canHold = true
    this.mino = this.upcomingMinos.shift()
    this.rotation = Phaser.Math.RND.between(0, this.mino.length - 1)

    if (this.upcomingMinos.length === 0) {
      this.upcomingMinos = this._generateUpcomingMinos()
    }

    const nextMino = this.upcomingMinos[0]
    this.scene.data.set('nextMino', this._getMinoFrames(nextMino))

    this._render()
  }

  placeMino = () => {
    const canPlaceMino = this.frames.every(({ x, y, frame }) => {
      const tile = this.scene.map.getTile(x, y)
      return frame === -1 || (tile && tile.index < 2)
    })

    if (!canPlaceMino) return false

    this.frames.forEach(({ x, y, frame }) => {
      if (frame > -1) this.scene.map.placeTile(x, y, frame)
    })

    return true
  }

  _render = () => {
    this.container.remove(this.container.list, true)

    this.frames = this._getMinoFrames().map((frame, i) => ({
      ...this._getCoords(i),
      frame,
    }))

    this.frames.forEach(({ frame }, index) => {
      if (frame === -1) return

      const x = 5 * (index % 3)
      const y = 5 * Math.floor(index / 3)
      const tile = this._getTileFromIndex(index)
      this.container.add(
        this.scene.add
          .sprite(x, y, 'tiles', frame)
          .setOrigin(0, 0)
          .setTint(tile && tile.index > 1 ? 0xcc4444 : 0x44cc44),
      )
    })
  }

  _getMinoFrames = (mino = this.mino) =>
    mino[Math.min(this.rotation, mino.length - 1)]

  _getTileFromIndex = (index) => {
    const { x, y } = this._getCoords(index)
    return this.scene.map.getTile(x, y)
  }

  _generateUpcomingMinos = () => {
    const types = Phaser.Math.RND.shuffle([
      ...LEVELS[this.scene.data.get('multi') - 1],
    ])
    return types.map((types) => Phaser.Math.RND.weightedPick(types))
  }

  _getCoords = (index) => {
    const { x: _x, y: _y } = this.container
    const x = (_x - 2) / 5 + (index % 3)
    const y = _y / 5 + Math.floor(index / 3)
    return { x, y }
  }
}
