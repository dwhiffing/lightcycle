import {
  TILE_CONNECTIONS,
  DIRECTION_ADJACENCY,
  TILE_DIRECTIONS,
  MAP_SIZE_Y,
  MAP_SIZE_X,
} from '../constants'

export default class {
  constructor(scene) {
    this.scene = scene
    const data = []
    for (let y = 0; y < MAP_SIZE_Y; y++) {
      data.push(new Array(MAP_SIZE_X).fill(1))
    }

    this.map = this.scene.make.tilemap({ data, tileWidth: 5, tileHeight: 5 })
    this.map.createDynamicLayer(0, this.map.addTilesetImage('tiles'), 2, 0)
  }

  getTile = (x, y) => this.map.getTileAt(x, y)

  placeTile = (x, y, index) => {
    if (index < 8 && this.map.getTileAt(x, y).index > 1) return null

    const tile = this.map.putTileAt(index, x, y)
    tile.tint = 0x999999
    return true
  }

  clearTiles = (tiles) => {
    tiles.forEach((tile) => (tile.tint = 0xffffff))

    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        tiles.forEach((t) => this.map.putTileAt(1, t.x, t.y))
        this.scene.marker._render()
      },
    })
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
    // TODO: This shouldn't use loopDirection, directions should be passed in instead
    // but how do we set loopDirection properly?
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
