import { generateUpcomingMinos } from '../utils'
import { EASY_LOOP, TILES_PLACED_PER_WILDCARD } from '../constants'
import { WILDCARD, SMALL_CORNER, BIG_ARCH } from '../minos'

export default class {
  constructor(scene) {
    this.scene = scene
    this.data = scene.data
    this.upcomingMinos = EASY_LOOP ? [BIG_ARCH] : [SMALL_CORNER]
    this.nextMino = this.upcomingMinos.shift()
    this.frames = []
    this.rotation = 0
    this.nextRotation = 0
    this.canPlace = false
    this.container =
      this.container || this.scene.add.container(22, 20).setDepth(9)
  }

  moveUp = () => this.move(0)
  moveLeft = () => this.move(3)
  moveRight = () => this.move(1)
  moveDown = () => this.move(2)

  rotateLeft = () => this.rotate(-1)
  rotateRight = () => this.rotate(1)

  clear = () => {
    this.mino = null
    this._render()
  }

  resetQueue = () => {
    this.upcomingMinos = generateUpcomingMinos(this.data.get('level') - 1)
  }

  hold = () => {
    if (!this.canHold) {
      this.scene.sound.play('error', { volume: 0.3 })
      return
    }

    this.scene.sound.play('hold')
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

    this.scene.sound.play('move', { volume: 0.25, rate: 1.5 })

    this._render()
  }

  rotate = (direction) => {
    if (!this.mino) {
      this.scene.sound.play('error', { volume: 0.3 })
      return
    }
    this.scene.sound.play('move', { volume: 0.3, rate: 2 })

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
    this.canPlace = true

    this.mino = this.nextMino
    this.rotation = this.nextRotation

    if (this.upcomingMinos.length === 0) {
      this.upcomingMinos = generateUpcomingMinos(this.data.get('level') - 1)
    }

    const minosPlaced = this.data.get('minosPlaced')
    if (minosPlaced > 0 && minosPlaced % TILES_PLACED_PER_WILDCARD === 0) {
      this.upcomingMinos[0] = WILDCARD
    }

    this.nextMino = this.upcomingMinos.shift()
    this.nextRotation = this.nextMino
      ? Phaser.Math.RND.between(0, this.nextMino.length - 1)
      : 0

    this.data.set(
      'nextMino',
      this._getMinoFrames(this.nextMino, this.nextRotation),
    )

    this._render()
  }

  canPlaceMino = ({ x, y, frame }) => {
    const tile = this.scene.map.getTile(x, y)
    const isWildcard = frame === 8
    const isVacant = frame === -1 || (tile && tile.index < 2)
    return isWildcard ? !isVacant : isVacant
  }

  placeMino = () => {
    const canPlaceMino = this.canPlace && this.frames.every(this.canPlaceMino)
    if (!canPlaceMino) {
      this.scene.sound.play('error', { volume: 0.3 })
      return false
    }
    this.canPlace = false
    this.canHold = false

    this.frames.forEach(({ x, y, frame }) => {
      if (frame > -1) this.scene.map.placeTile(x, y, frame)
    })

    this.mino = null
    this._render()

    return true
  }

  getIsWildcard = () => this._getMinoFrames().some((frame) => frame === 8)

  _render = () => {
    this.container =
      this.container || this.scene.add.container(7, 5).setDepth(9)
    if (!this.container.active) return

    this.frames = this._getMinoFrames().map((frame, i) => ({
      ...this._getCoords(i),
      frame,
    }))

    this.container.remove(this.container.list, true)

    this.frames.forEach(({ frame }, index) => {
      if (frame === -1) return

      const x = 5 * (index % 3)
      const y = 5 * Math.floor(index / 3)
      const canPlace = this.canPlaceMino({ ...this._getCoords(index), frame })
      this.container.add(
        this.scene.add
          .sprite(x, y, 'tiles', frame)
          .setOrigin(0, 0)
          .setTint(
            canPlace
              ? this.scene.cursorColor.color
              : this.scene.cursorErrorColor.color,
          ),
      )
    })

    this.container.add(
      this.scene.add.sprite(5, 5, 'tiles', 0).setOrigin(0, 0).setAlpha(0.8),
    )

    const { x: _x, y: _y, list } = this.container
    if (!list.every(({ x }) => x + _x > -1)) this.moveRight()
    if (!list.every(({ y }) => y + _y > -1)) this.moveDown()
    if (!list.every(({ x }) => x + _x < 62)) this.moveLeft()
    if (!list.every(({ y }) => y + _y < 54)) this.moveUp()
  }

  _getMinoFrames = (mino = this.mino, rotation = this.rotation) =>
    mino ? mino[Math.min(rotation, mino.length - 1)] : []

  _getCoords = (index) => {
    const { x: _x, y: _y } = this.container
    const x = (_x - 2) / 5 + (index % 3)
    const y = _y / 5 + Math.floor(index / 3)
    return { x, y }
  }
}
