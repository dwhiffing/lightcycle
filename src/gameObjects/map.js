import {
  TILE_CONNECTIONS,
  DIRECTION_ADJACENCY,
  TILE_DIRECTIONS,
  MAP_SIZE_Y,
  MAP_SIZE_X,
  LINE_ANIM_DURATION,
  EXPLODE_ANIM_DURATION,
  EXPLODE_ANIM_DELAY,
  LINE_ANIM_OFFSET,
} from '../constants'

export default class {
  constructor(scene) {
    this.scene = scene
    this.data = scene.data
    this.activeIndex = 0
    const data = []
    for (let y = 0; y < MAP_SIZE_Y; y++) {
      data.push(new Array(MAP_SIZE_X).fill(1))
    }

    this.map = this.scene.make.tilemap({ data, tileWidth: 5, tileHeight: 5 })
    this.map
      .createDynamicLayer(0, this.map.addTilesetImage('tiles'), 2, 0)
      .setDepth(3)

    this.render()

    this.scene.time.addEvent({
      delay: 25,
      repeat: -1,
      callback: this.render,
    })

    this.lineGraphics = this.scene.add.graphics().setDepth(7)
    this.particles = this.scene.add.particles('spark').setDepth(20)
    this.emitter = this.particles
      .createEmitter({
        speed: 10,
        angle: { min: 0, max: 360 },
        alpha: { start: 0.7, end: 0 },
        lifespan: { max: 800, min: 200 },
      })
      .stop()
    this.emitter2 = this.particles
      .createEmitter({
        speed: 20,
        angle: { min: 0, max: 360 },
        alpha: { start: 0.7, end: 0 },
        lifespan: { max: 1200, min: 400 },
      })
      .stop()
  }

  getTile = (x, y) => this.map.getTileAt(x, y)

  placeTile = (x, y, index) => {
    if (index < 8 && this.map.getTileAt(x, y).index > 1) return null
    this._setEmitters(x * 5 + 4, y * 5 + 3, 5)

    this.map.putTileAt(index, x, y)
    return true
  }

  clearTiles = (tiles) => {
    tiles.forEach(this._animateTileDestroy)

    tiles.forEach((tile) => {
      this.map.putTileAt(1, tile.x, tile.y)
    })

    this.scene.marker._render()
  }

  getOffset = (value, index, amount) =>
    Math.abs(((value + index) % amount) - amount / 2)

  render = () => {
    if (!this.map.layer) return
    this.activeIndex += this.data.get('level') / 3

    this.map.layer.data.flat().forEach((tile, index, tiles) => {
      const numTiles = tiles.length
      const color = this.scene.bgColor.clone()

      const amount = numTiles * 3
      const offset = this.getOffset(this.activeIndex, index, amount)
      const hueShift = (offset - amount / 2) / 2000
      color._h = Phaser.Math.Clamp(hueShift + color._h, 0, 1)

      if (tile.index > 1) {
        const offset = this.getOffset(
          this.activeIndex * 1.2,
          index,
          numTiles * 2,
        )
        color.darken(Phaser.Math.Clamp(offset, 5, 30)).desaturate(10)
      } else {
        const offset = this.getOffset(this.activeIndex, index, numTiles * 1.5)
        color.darken(Phaser.Math.Clamp(offset, 30, 60))
      }

      tile.tint = color.color
    })
  }

  _setEmitters = (x, y, amount) => {
    this.emitter.setPosition(x, y)
    this.emitter2.setPosition(x, y)

    const factor = 0.02 + 0.01 * this.data.get('level')

    const color1 = this.scene.bgColor.clone()
    color1._h = Phaser.Math.Clamp(color1._h + factor, 0, 1)

    color1.saturate(10)
    this.emitter.setTint(color1.color)
    this.emitter.explode(amount)

    const color2 = this.scene.bgColor.clone()
    color2._h = Phaser.Math.Clamp(color2._h - factor, 0, 1)
    color2.saturate(10)
    this.emitter2.setTint(color2.color)
    this.emitter2.explode(amount)
  }

  // TODO: need to refactor
  // TODO: Fix wildcard cases
  // TODO: make animation start from last placed tile
  _animateTileDestroy = (tile, index, tiles) => {
    const sprite = this.scene.add
      .sprite(tile.pixelX + 4, tile.pixelY + 2, 'tiles', tile.index)
      .setDepth(5)
      .setTint(this.scene.bgColor.color)
    const lineDuration = LINE_ANIM_DURATION - 60 * this.data.get('level')
    const speed = lineDuration / (tiles.length * 5)
    this._drawTileLine(tile, tiles[index + 1], index, sprite, speed)

    if (index === tiles.length - 1) {
      this._drawTileLine(tile, tiles[0], index, sprite, speed)
    }

    const explodeDelay =
      lineDuration + index * (EXPLODE_ANIM_DELAY - 5 * this.data.get('level'))

    this.scene.time.addEvent({
      delay: lineDuration + LINE_ANIM_OFFSET,
      callback: () => {
        this.lineGraphics.clear()
      },
    })

    this.scene.tweens.add({
      delay: explodeDelay,
      targets: [sprite],
      duration: EXPLODE_ANIM_DURATION,
      scale: 3,
      ease: Phaser.Tweens.Builders.GetEaseFunction('Circular.Out'),
      alpha: 0,
      onComplete: () => {
        sprite.destroy()
      },
      callback: () => {
        this._setEmitters(sprite.x, sprite.y, 20)
        const level = this.data.get('level')
        this.scene.sound.play(`place${Math.min(7, level)}`, {
          rate: Math.min(1.55, 0.35 + 0.02 * index + (level - 1) * 0.15),
        })
      },
    })
  }

  _drawTileLine = (tile, nextTile, index, sprite, speed) => {
    for (let i = 0; i < 5; i++) {
      let { x, y } = sprite
      const delay = index * speed * 5 + speed * i
      if (nextTile && nextTile.x !== tile.x) {
        x = nextTile.x > tile.x ? x + i : x - i
      }
      if (nextTile && nextTile.y !== tile.y) {
        y = nextTile.y > tile.y ? y + i : y - i
      }
      const color = this.scene.bgColor.clone()
      color.brighten(20)
      this.scene.time.addEvent({
        delay: delay,
        callback: () =>
          this.lineGraphics.fillStyle(color.color).fillRect(x, y, 1, 1),
      })

      this.scene.time.addEvent({
        delay: delay + LINE_ANIM_OFFSET,
        callback: () =>
          this.lineGraphics.fillStyle(0x000000).fillRect(x, y, 1, 1),
      })
    }
  }

  clearLoop() {
    const loop = this.getLoop()
    if (loop) {
      this.data.values.loops++
      this.clearTiles(loop)
    }
    return loop
  }

  // TODO: this does not always clear wildcard unfinished loops completely
  getLoop() {
    let allTiles = this.map.layer.data.flat().filter(({ index }) => index > 1)
    let tiles = [...allTiles]

    while (tiles.length > 0) {
      let loop = []
      let current = tiles[0]
      this.loopDirection = null

      // TODO: need to refactor
      // clear normal loops
      while (current) {
        loop.push(current)
        tiles = tiles.filter((t) => t !== current)

        current = this._getNextTileInLoop([...tiles, loop[0]], current)
        if (current === loop[0]) return loop
      }

      // clear wildcard loops
      if (loop.some((t) => t.index === 8)) {
        this.loopDirection = null
        let tiles = allTiles.filter((t) => !loop.find((_t) => t === _t))
        current = this._getNextTileInLoop(tiles, loop[0])

        while (current) {
          loop.push(current)
          tiles = tiles.filter((t) => t !== current)
          current = this._getNextTileInLoop(tiles, current)
        }

        return loop
      }
    }
  }

  _getNextTileInLoop(tiles, sourceTile) {
    const directions = this.loopDirection
      ? [TILE_DIRECTIONS[sourceTile.index][this.loopDirection]]
      : [0, 2, 3, 1]

    return tiles.find((tile) =>
      directions.some((direction) => {
        this.loopDirection = direction
        return this._getIsConnected(tile, sourceTile, direction)
      }),
    )
  }

  _getIsConnected(tileA, tileB, direction) {
    const { x, y } = DIRECTION_ADJACENCY[direction]
    const isAdjacent = tileA.x === tileB.x + x && tileA.y === tileB.y + y
    const validConnections = TILE_CONNECTIONS[tileB.index][direction] || []
    const isConnected = validConnections.includes(tileA.index)

    return isAdjacent && isConnected && tileA !== tileB
  }
}
