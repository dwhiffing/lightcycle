import { SMALL_LINE } from '../constants'
import { generateUpcomingMinos } from '../utils'

export default class {
  constructor(scene) {
    this.scene = scene
    this.data = scene.data
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
    this.data.set('heldMino', this._getMinoFrames(this.heldMino))
  }

  move = (direction) => {
    if (direction === 0) {
      this.container.y -= this.container.y < -2 ? 0 : 5
    } else if (direction === 3) {
      this.container.x -= this.container.x < -2 ? 0 : 5
    } else if (direction === 2) {
      this.container.y += this.container.y > 40 ? 0 : 5
    } else if (direction === 1) {
      this.container.x += this.container.x > 50 ? 0 : 5
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
      this.upcomingMinos = generateUpcomingMinos(this.data.get('multi') - 1)
    }

    const nextMino = this.upcomingMinos[0]
    this.data.set('nextMino', this._getMinoFrames(nextMino))

    this._render()
  }

  canPlaceTile = ({ x, y, frame }) => {
    const tile = this.scene.map.getTile(x, y)
    const isWildcard = frame === 8
    const isVacant = frame === -1 || (tile && tile.index < 2)
    return isWildcard ? !isVacant : isVacant
  }

  placeMino = () => {
    const canPlaceMino = this.frames.every(this.canPlaceTile)
    if (!canPlaceMino) return false

    this.frames.forEach(({ x, y, frame }) => {
      if (frame > -1) this.scene.map.placeTile(x, y, frame)
    })

    this.getNextMino()
    return true
  }

  _render = () => {
    this.frames = this._getMinoFrames().map((frame, i) => ({
      ...this._getCoords(i),
      frame,
    }))

    this.container.remove(this.container.list, true)

    this.frames.forEach(({ frame }, index) => {
      if (frame === -1) return

      const x = 5 * (index % 3)
      const y = 5 * Math.floor(index / 3)
      const canPlace = this.canPlaceTile({ ...this._getCoords(index), frame })
      this.container.add(
        this.scene.add
          .sprite(x, y, 'tiles', frame)
          .setOrigin(0, 0)
          .setTint(canPlace ? 0x44cc44 : 0xcc4444),
      )
    })

    const { x: _x, y: _y, list } = this.container
    if (!list.every(({ x }) => x + _x > -1)) this.moveRight()
    if (!list.every(({ y }) => y + _y > -1)) this.moveDown()
    if (!list.every(({ x }) => x + _x < 62)) this.moveLeft()
    if (!list.every(({ y }) => y + _y < 54)) this.moveUp()
  }

  _getMinoFrames = (mino = this.mino) =>
    mino[Math.min(this.rotation, mino.length - 1)]

  _getCoords = (index) => {
    const { x: _x, y: _y } = this.container
    const x = (_x - 2) / 5 + (index % 3)
    const y = _y / 5 + Math.floor(index / 3)
    return { x, y }
  }
}
