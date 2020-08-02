export default class {
  constructor(scene) {
    this.scene = scene
    const data = []
    for (let y = 0; y < 10; y++) {
      data.push([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
    }

    this.map = this.scene.make.tilemap({ data, tileWidth: 5, tileHeight: 5 })
    this.map.createDynamicLayer(0, this.map.addTilesetImage('tiles'), 2, 0)
  }

  placeTile(_x, _y, index) {
    const x = (_x - 2) / 5
    const y = _y / 5
    if (this.map.getTileAt(x, y).index > 1) return null

    this.map.putTileAt(index, x, y)
    this.checkForLoops()
    return true
  }

  checkForLoops() {
    let tiles = this.map.layer.data.flat().filter((tile) => tile.index > 1)
    let loopTiles = []
    tiles.forEach((tile) => (tile.tint = 0x999999))

    while (tiles.length > 1) {
      let isLoop = false
      loopTiles = [tiles[0]]

      let [neighbour, direction] = this.getNeighbour(
        tiles.filter((t) => t !== loopTiles[0]),
        loopTiles[0],
      )

      tiles = tiles.filter((p) => p !== neighbour)
      if (neighbour) {
        loopTiles.push(neighbour)
      }

      while (neighbour) {
        let [next] = this.getNeighbour(
          tiles,
          neighbour,
          DIRECTIONS[neighbour.index][direction],
        )
        isLoop = next && next.x === loopTiles[0].x && next.y === loopTiles[0].y

        let [newNeighbour, newDirection] = this.getNeighbour(
          tiles.filter((t) => t !== loopTiles[0]),
          neighbour,
        )
        neighbour = newNeighbour
        direction = newDirection
        if (neighbour) {
          loopTiles.push(newNeighbour)
        }

        if (neighbour !== loopTiles[0]) {
          tiles = tiles.filter((p) => p !== neighbour)
        }
      }

      if (isLoop) {
        this.clearTiles([...loopTiles])
      }

      tiles.shift()
    }
  }

  // checkForLoops() {
  //   let tiles = this.map.layer.data.flat().filter((tile) => tile.index > 1)
  //   let loopTiles = []
  //   const startTile = tiles[0]

  //   while (tiles.length > 1) {
  //     let isLoop = false
  //     let direction
  //     let currentTile = startTile
  //     loopTiles = []

  //     while (currentTile) {
  //       loopTiles.push(currentTile)
  //       tiles = tiles.filter((t) => t !== currentTile || t === startTile)
  //       console.log({
  //         currentTile: `${currentTile.x}, ${currentTile.y}`,
  //         direction,
  //         tiles: loopTiles.map((t) => `${t.x}, ${t.y}`),
  //         other: tiles,
  //       })

  //       let [neighbour, _direction] = this.getNeighbour(
  //         tiles,
  //         currentTile,
  //         direction,
  //       )
  //       currentTile = neighbour
  //       direction = _direction
  //       isLoop = neighbour === startTile
  //     }

  //     if (isLoop) {
  //       this.clearTiles([...loopTiles])
  //     }

  //     tiles.shift()
  //   }
  // }

  clearTiles(tiles) {
    tiles.forEach((tile) => (tile.tint = 0xffffff))
    this.scene.time.addEvent({
      delay: 1000,
      callback: () =>
        tiles.forEach((t) => {
          this.map.putTileAt(1, t.x, t.y)
        }),
    })
  }

  getNeighbour(tiles, tile, directionFilter = '') {
    let direction

    const neighbour = tiles.find((_tile) => {
      const data = LOOP_DATA[tile.index]

      const check = (dir) => {
        const { x, y } = ADJACENCIES[dir]
        if (
          _tile.x === tile.x + x &&
          _tile.y === tile.y + y &&
          (data[dir] || []).includes(_tile.index) &&
          directionFilter.match(new RegExp(`${dir}|^$`))
        ) {
          direction = dir
          return true
        }
      }

      return check('up') || check('down') || check('left') || check('right')
    })

    return [neighbour, direction]
  }
}

const LOOP_DATA = {
  2: { down: [2, 4, 7], up: [2, 5, 6] },
  3: { right: [3, 5, 7], left: [3, 4, 6] },
  4: { up: [2, 5, 6], right: [3, 5, 7] },
  5: { down: [2, 4, 7], left: [3, 4, 6] },
  6: { down: [2, 4, 7], right: [3, 5, 7] },
  7: { up: [2, 5, 6], left: [3, 4, 6] },
}

const DIRECTIONS = {
  2: { up: 'up', down: 'down' },
  3: { left: 'left', right: 'right' },
  4: { down: 'right', left: 'up' },
  5: { up: 'left', right: 'down' },
  6: { left: 'down', up: 'right' },
  7: { down: 'left', right: 'up' },
}

const ADJACENCIES = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}
