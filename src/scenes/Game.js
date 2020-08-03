import Map from '../gameObjects/map'
import UI from '../gameObjects/ui'
import Marker from '../gameObjects/marker'
import { TICK, SCORES, TIME_DURATION } from '../constants'

// add wildcard tile
// clear tiles inside loop
// sounds
// fancy effects on placing/clearing tiles
// title graphic
// add credits/help
// prevent marker from being outside playing area
// add key repeat on hold

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {}

  create() {
    this.registry.set('score', 0)
    this.registry.set('lives', 3)
    this.registry.set('multi', 1)
    this.registry.set('timerMax', TIME_DURATION)
    this.registry.set('timer', TIME_DURATION)

    this.map = new Map(this)
    this.ui = new UI(this)
    this.marker = new Marker(this)

    this.input.keyboard.removeAllKeys(true)
    this.keys = this.input.keyboard.addKeys('W,A,S,D,Q,E,R,SPACE')
    this.keys.W.on('down', this.marker.moveUp)
    this.keys.A.on('down', this.marker.moveLeft)
    this.keys.S.on('down', this.marker.moveDown)
    this.keys.D.on('down', this.marker.moveRight)
    this.keys.Q.on('down', this.marker.rotateLeft)
    this.keys.E.on('down', this.marker.rotateRight)
    this.keys.R.on('down', this.marker.hold)
    this.keys.SPACE.on('down', this.placeTiles)

    this.time.addEvent({ delay: TICK, repeat: -1, callback: this.tick })
  }

  tick = () => {
    const timer = this.registry.get('timer')
    this.registry.set('timer', timer - TICK)
    if (timer < 1) this.timeOut()
  }

  placeTiles = () => {
    if (!this.marker.canPlaceTiles()) return

    this.marker.placeTiles()

    const loop = this.map.getLoop()
    if (loop) {
      this.map.clearTiles(loop)
      this.addScore(loop.length * 100)
    }
    this.marker.getNextMino()

    this.registry.set('timer', this.registry.get('timerMax'))
  }

  timeOut = () => {
    this.updateLives(-1)
    this.marker.getNextMino()
    this.registry.set('timer', this.registry.get('timerMax'))
    if (this.registry.get('lives') < 0) {
      this.scene.start('Menu')
    }
  }

  addScore = (score) => {
    this.registry.set('multi', this._getMulti())
    const newScore =
      +this.registry.get('score') + score * this.registry.get('multi')
    this.registry.set('score', newScore)

    this.registry.set(
      'timerMax',
      TIME_DURATION - (this.registry.get('multi') - 1) * 600,
    )

    // TODO: extra lives every x points
    // if (this.registry.get('loops') % 25 === 0) {
    //   this.updateLives(1)
    // }
  }

  updateLives = (value) => {
    this.registry.set('lives', Math.min(10, this.registry.get('lives') + value))
  }

  _getMulti = () => {
    const score = this.registry.get('score')
    for (let key in SCORES) {
      if (score < key) return SCORES[key]
    }
    return 9
  }
}
