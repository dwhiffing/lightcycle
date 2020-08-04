import {
  TILE_CONNECTIONS,
  DIRECTION_ADJACENCY,
  TILE_DIRECTIONS,
  MAP_SIZE_Y,
  MAP_SIZE_X,
  LINE_ANIM_DURATION,
  EXPLODE_ANIM_DELAY,
  EXPLODE_ANIM_DURATION,
  LINE_ANIM_OFFSET,
} from '../constants'

export default class {
  constructor(scene) {
    this.scene = scene
    const data = []
    for (let y = 0; y < MAP_SIZE_Y; y++) {
      data.push(new Array(MAP_SIZE_X).fill(1))
    }

    this.map = this.scene.make.tilemap({ data, tileWidth: 5, tileHeight: 5 })
    this.map
      .createDynamicLayer(0, this.map.addTilesetImage('tiles'), 2, 0)
      .setDepth(3)

    this.lineGraphics = this.scene.add.graphics().setDepth(7)
    this.particles = this.scene.add.particles('spark').setDepth(20)
    this.emitter = this.particles
      .createEmitter({
        speed: { min: -30, max: 30 },
        angle: { min: 0, max: 360 },
        alpha: { start: 0.5, end: 0 },
        lifespan: { max: 800, min: 300 },
      })
      .stop()
  }

  getTile = (x, y) => this.map.getTileAt(x, y)

  placeTile = (x, y, index) => {
    if (index < 8 && this.map.getTileAt(x, y).index > 1) return null

    const tile = this.map.putTileAt(index, x, y)
    tile.tint = 0x999999
    return true
  }

  clearTiles = (tiles) => {
    tiles.forEach(this._animateTileDestroy)

    tiles.forEach((tile) => {
      tile.tint = 0xffffff
      this.map.putTileAt(1, tile.x, tile.y)
    })

    this.scene.marker._render()
  }

  // TODO: need to refactor
  // TODO: Fix wildcard cases
  // TODO: make animation start from last placed tile
  _animateTileDestroy = (tile, index, tiles) => {
    const sprite = this.scene.add
      .sprite(tile.pixelX + 4, tile.pixelY + 2, 'tiles', tile.index)
      .setDepth(5)

    this._drawTileLine(tile, tiles[index + 1], index, sprite)

    if (index === tiles.length - 1) {
      this._drawTileLine(tile, tiles[0], index, sprite)
    }

    const explodeDelay = LINE_ANIM_DURATION * 30 + index * EXPLODE_ANIM_DELAY

    this.scene.time.addEvent({
      delay: LINE_ANIM_DURATION * 5 * tiles.length + LINE_ANIM_OFFSET,
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
        this.emitter.setPosition(sprite.x, sprite.y)
        // TODO: use other place sounds
        this.scene.sound.play('place1', { rate: 0.6 + 0.075 * index })
        this.emitter.explode(10)
      },
    })
  }

  _drawTileLine = (tile, nextTile, index, sprite) => {
    for (let i = 0; i < 5; i++) {
      let { x, y } = sprite
      const delay = index * LINE_ANIM_DURATION * 5 + LINE_ANIM_DURATION * i
      if (nextTile && nextTile.x !== tile.x) {
        x = nextTile.x > tile.x ? x + i : x - i
      }
      if (nextTile && nextTile.y !== tile.y) {
        y = nextTile.y > tile.y ? y + i : y - i
      }

      this.scene.time.addEvent({
        delay: delay,
        callback: () =>
          this.lineGraphics.fillStyle(0xffffff).fillRect(x, y, 1, 1),
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
      this.scene.data.values.loops++
      this.scene.data.values.multiCounter++
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
