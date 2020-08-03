import Map from '../gameObjects/map'
import UI from '../gameObjects/ui'
import Marker from '../gameObjects/marker'
import { TICK, TIME_DURATION } from '../constants'
import { getMultiFromScore } from '../utils'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {}

  create() {
    this.data.set('score', 0)
    this.data.set('loops', 0)
    this.data.set('lives', 3)
    this.data.set('multi', 1)
    this.data.set('timerMax', TIME_DURATION)
    this.data.set('timer', TIME_DURATION)

    this.map = new Map(this)
    this.ui = new UI(this)
    this.marker = new Marker(this)

    this.input.keyboard.removeAllKeys(true)
    this.keys = this.input.keyboard.addKeys('W,A,S,D,Q,E,R,SPACE')
    this.keys.W.on('down', this.marker.moveUp).setEmitOnRepeat(true)
    this.keys.A.on('down', this.marker.moveLeft).setEmitOnRepeat(true)
    this.keys.S.on('down', this.marker.moveDown).setEmitOnRepeat(true)
    this.keys.D.on('down', this.marker.moveRight).setEmitOnRepeat(true)
    this.keys.Q.on('down', this.marker.rotateLeft)
    this.keys.E.on('down', this.marker.rotateRight)
    this.keys.R.on('down', this.marker.hold)
    this.keys.SPACE.on('down', this.placeMino)

    this.time.addEvent({ delay: TICK, repeat: -1, callback: this.tick })
  }

  tick = () => {
    const timer = this.data.get('timer')
    this.data.set('timer', timer - TICK)
    if (timer < 1) this.timeOut()
  }

  timeOut = () => {
    this.updateLives(-1)
    this.marker.getNextMino()
    this.data.set('timer', this.data.get('timerMax'))
    if (this.data.get('lives') < 0) {
      this.registry.set('score', this.data.get('score'))
      this.scene.start('Menu')
    }
  }

  placeMino = () => {
    if (!this.marker.placeMino()) return

    const loop = this.map.clearLoop() || []
    this.addScore(loop.length * 100)
    this.data.set('timer', this.data.get('timerMax'))
  }

  addScore = (value) => {
    if (value === 0) return

    if (this.data.get('loops') % 10 === 0) this.updateLives(1)

    const newScore = +this.data.get('score') + value * this.data.get('multi')
    this.data.set('score', newScore)
    this.data.set('multi', getMultiFromScore(newScore))

    const newTimerMax = TIME_DURATION - (this.data.get('multi') - 1) * 600
    this.data.set('timerMax', newTimerMax)
  }

  updateLives = (value) =>
    this.data.set('lives', Math.min(10, this.data.get('lives') + value))
}
