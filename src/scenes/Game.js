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

    this.keys = this.input.keyboard.addKeys('W,A,S,D,Q,E,SPACE', true, true)

    this.keys.Q.on('down', () => {
      this.tileIndex += this.tileIndex < 7 ? 1 : -5
      this.marker.setFrame(this.tileIndex)
    })

    this.keys.E.on('down', () => {
      this.tileIndex += this.tileIndex > 2 ? -1 : 5
      this.marker.setFrame(this.tileIndex)
    })

    this.keys.SPACE.on('down', () => {
      const x = (this.marker.x - 2) / 5
      const y = (this.marker.y - 2) / 5
      map.putTileAt(this.tileIndex, x, y)
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
    // get all tiles
    // remove empty
    // while there are tiles to check
    // check the next tile
    // find adjacent neighbour with connection in list of tiles to check
    // if present, remove from list repeat with found neighbour until none are found or we have linked to the first tile
  }

  update() {}
}
