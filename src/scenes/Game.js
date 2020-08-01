// TODO: Refactor
// improve rng by shuffling full sets
// add tile holding
// add composite placed tiles
// add cross tile
// add 3 way tile
export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init(opts) {}

  create() {
    this.moveTimer = 0
    this.tileIndex = 2

    const data = []
    for (let y = 0; y < 9; y++) {
      data.push([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
    }

    this.map = this.make.tilemap({ data, tileWidth: 5, tileHeight: 5 })
    this.map.createDynamicLayer(0, this.map.addTilesetImage('tiles'), 2, 2)

    this.marker = this.add
      .sprite(2, 2, 'tiles', 0)
      .setOrigin(0, 0)
      .setFrame(this.tileIndex)
      .setTint(0x44cc44)

    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE')

    this.keys.SPACE.on('down', () => {
      const x = (this.marker.x - 2) / 5
      const y = (this.marker.y - 2) / 5
      const clickedTile = this.map.getTileAt(x, y)
      if (clickedTile.index > 1) return
      this.map.putTileAt(this.tileIndex, x, y)
      this.checkForLoops()
      this.tileIndex = Phaser.Math.RND.between(2, 7)
      this.marker.setFrame(this.tileIndex)
    })

    this.keys.W.on('down', () => {
      if (this.marker.y < 3) return
      this.marker.y -= 5
    })

    this.keys.A.on('down', () => {
      if (this.marker.x < 3) return
      this.marker.x -= 5
    })

    this.keys.S.on('down', () => {
      if (this.marker.y > 40) return
      this.marker.y += 5
    })

    this.keys.D.on('down', () => {
      if (this.marker.x > 53) return
      this.marker.x += 5
    })
  }

  checkForLoops() {
    let tiles = this.map.layer.data.flat().filter((tile) => tile.index > 1)
    let loopTiles = []
    tiles.forEach((tile) => (tile.tint = 0x999999))
    while (tiles.length > 1) {
      loopTiles = []
      let isLoop = false
      const startTile = tiles[0]
      let [neighbour, direction] = this.getNeighbour(
        tiles.filter((t) => t !== startTile),
        startTile,
      )
      loopTiles.push(startTile)

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
        isLoop = next && next.x === startTile.x && next.y === startTile.y

        let [newNeighbour, newDirection] = this.getNeighbour(
          tiles.filter((t) => t !== startTile),
          neighbour,
        )
        neighbour = newNeighbour
        direction = newDirection
        if (neighbour) {
          loopTiles.push(newNeighbour)
        }

        if (neighbour !== startTile) {
          tiles = tiles.filter((p) => p !== neighbour)
        }
      }
      if (isLoop) {
        const tiles = [...loopTiles]
        tiles.forEach((tile) => (tile.tint = 0xffffff))
        this.time.addEvent({
          delay: 1000,
          callback: () =>
            tiles.forEach((t) => {
              this.map.putTileAt(1, t.x, t.y)
            }),
        })
      }

      tiles.shift()
    }
  }

  getNeighbour(tiles, tile, directionFilter) {
    let direction
    const neighbour = tiles.find((_tile) => {
      const left = _tile.x === tile.x - 1 && _tile.y === tile.y
      const right = _tile.x === tile.x + 1 && _tile.y === tile.y
      const up = _tile.x === tile.x && _tile.y === tile.y - 1
      const down = _tile.x === tile.x && _tile.y === tile.y + 1
      const tileMatch = LOOP_DATA[tile.index]

      if (
        up &&
        tileMatch.up &&
        tileMatch.up.includes(_tile.index) &&
        (!directionFilter || directionFilter === 'up')
      ) {
        direction = 'up'
        return true
      }
      if (
        down &&
        tileMatch.down &&
        tileMatch.down.includes(_tile.index) &&
        (!directionFilter || directionFilter === 'down')
      ) {
        direction = 'down'
        return true
      }
      if (
        left &&
        tileMatch.left &&
        tileMatch.left.includes(_tile.index) &&
        (!directionFilter || directionFilter === 'left')
      ) {
        direction = 'left'
        return true
      }
      if (
        right &&
        tileMatch.right &&
        tileMatch.right.includes(_tile.index) &&
        (!directionFilter || directionFilter === 'right')
      ) {
        direction = 'right'
        return true
      }
    })

    return [neighbour, direction]
  }

  update() {}
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
