import Map from '../gameObjects/map'
import UI from '../gameObjects/ui'
import Marker from '../gameObjects/marker'
import {
  TIME_OUT_DURATION,
  TICK,
  TIMER_DURATION,
  EXPLODE_ANIM_DELAY,
  MULTI_COUNTER,
  COLORS,
  LINE_ANIM_DURATION,
} from '../constants'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {}

  create() {
    this.cameras.main.fadeFrom(1000, 0, 0, 0, true)
    this.data.set('minosPlaced', 0)
    this.data.set('score', 0)
    this.data.set('multiCounter', 0)
    this.data.set('loops', 0)
    this.data.set('lives', 3)
    this.data.set('multi', 1)
    this.data.set('timerMax', TIMER_DURATION)
    this.data.set('timer', TIMER_DURATION)

    this.updateColor()

    this.map = new Map(this)
    this.ui = new UI(this)
    this.marker = new Marker(this)

    this.input.keyboard.removeAllKeys(true)
    this.keys = this.input.keyboard.addKeys(
      'W,A,S,D,Q,E,R,UP,DOWN,LEFT,RIGHT,Z,X,C,SPACE',
    )
    this.keys.W.on('down', this.marker.moveUp).setEmitOnRepeat(true)
    this.keys.A.on('down', this.marker.moveLeft).setEmitOnRepeat(true)
    this.keys.S.on('down', this.marker.moveDown).setEmitOnRepeat(true)
    this.keys.D.on('down', this.marker.moveRight).setEmitOnRepeat(true)
    this.keys.Q.on('down', this.marker.rotateLeft)
    this.keys.E.on('down', this.marker.rotateRight)
    this.keys.R.on('down', this.marker.hold)

    this.keys.UP.on('down', this.marker.moveUp).setEmitOnRepeat(true)
    this.keys.LEFT.on('down', this.marker.moveLeft).setEmitOnRepeat(true)
    this.keys.DOWN.on('down', this.marker.moveDown).setEmitOnRepeat(true)
    this.keys.RIGHT.on('down', this.marker.moveRight).setEmitOnRepeat(true)
    this.keys.Z.on('down', this.marker.rotateLeft)
    this.keys.X.on('down', this.marker.rotateRight)
    this.keys.C.on('down', this.marker.hold)

    this.keys.SPACE.on('down', this.placeMino)

    this.time.addEvent({ delay: TICK, repeat: -1, callback: this.tick })
    this.time.addEvent({ delay: 1000, callback: this.nextMino })

    this.particles = this.add.particles('spark').setDepth(20)
    this.emitter = this.particles
      .createEmitter({
        speed: { min: -30, max: 30 },
        angle: { min: 0, max: 360 },
        alpha: { start: 0.5, end: 0 },
        lifespan: { max: 800, min: 300 },
      })
      .stop()
  }

  tick = () => {
    const timer = this.data.get('timer')
    if (this.marker.mino) {
      if (timer && timer <= 5000 && timer % 1000 === 0) {
        this.sound.play('move', {
          volume: (6000 - timer) / 5000,
          rate: 0.6 - (6000 - timer) / 15000,
        })
      }
      this.data.set('timer', timer - TICK)
      if (timer < 1) this.timeOut()
    }
  }

  nextMino = () => {
    this.data.set('timer', this.data.get('timerMax'))
    this.marker.getNextMino()
    this.sound.play('click', { volume: 0.2, rate: 2 })
  }

  timeOut = () => {
    this.data.set('multi', 1)
    this.data.set('multiCounter', 0)
    const newTimerMax = TIMER_DURATION - (this.data.get('multi') - 1) * 600
    this.data.set('timerMax', newTimerMax)
    this.updateColor()
    this.marker.clear()
    this.sound.play('timeout', { volume: 0.5 })

    this.emitter.setPosition(
      this.marker.container.x + 7,
      this.marker.container.y + 7,
    )
    this.emitter.setTint(this.cursorColor.color)
    this.emitter.explode(100)

    if (!this.marker.getIsWildcard()) {
      this.updateLives(-1)
    }

    this.time.addEvent({ delay: TIME_OUT_DURATION, callback: this.nextMino })
    this.cameras.main.shake(100)

    if (this.data.get('lives') < 0) {
      this.registry.set('score', this.data.get('score'))
      this.scene.start('Menu')
    }
  }

  placeMino = () => {
    if (!this.marker.placeMino()) return

    this.sound.play('click', { volume: 0.2 })
    this.data.set('minosPlaced', this.data.get('minosPlaced') + 1)
    const multi = this.data.get('multi')

    const loop = this.map.clearLoop() || []

    const score =
      loop.length *
      (loop.filter((t) => [4, 5, 6, 7].includes(t.index)).length + 1)

    loop.length > 0 && this.sound.play('loop', { rate: 0.7 + 0.05 * multi })
    const lineAnimDelay = LINE_ANIM_DURATION - 70 * multi
    const loopAnimDelay = loop.length * (EXPLODE_ANIM_DELAY - 5 * multi)
    const minoDelay = 1000 - 100 * multi
    this.time.addEvent({
      delay: loop.length > 1 ? lineAnimDelay + loopAnimDelay : 0,
      callback: () => {
        this.time.addEvent({ delay: minoDelay, callback: this.nextMino })

        this.addScore(score)
      },
    })
  }

  addScore = (value) => {
    if (value === 0) return

    if (this.data.get('loops') % 10 === 0) this.updateLives(1)
    const increase = value * this.data.get('multi')
    const newScore = +this.data.get('score') + increase
    this.data.set('score', newScore)
    this.ui.setPointText(increase)

    if (
      this.data.get('multiCounter') >= MULTI_COUNTER[this.data.get('multi')] &&
      this.data.get('multi') < 9
    ) {
      this.time.addEvent({
        delay: 100,
        callback: () => {
          const multi = this.data.get('multi')
          this.sound.play(`multi${Math.min(6, multi)}`, {
            rate: 0.7 + (multi - 1) * 0.1,
          })
          this.data.set('multi', multi + 1)
          this.updateColor()
          const color = this.bgColor.clone()
          color.darken(70)
          this.cameras.main.flash(900, color.red, color.green, color.blue)
        },
      })
    }

    const newTimerMax = TIMER_DURATION - (this.data.get('multi') - 1) * 600
    this.data.set('timerMax', newTimerMax)
    this.data.set('timer', this.data.get('timerMax'))
  }

  updateLives = (value) =>
    this.data.set('lives', Math.min(10, this.data.get('lives') + value))

  updateColor = () => {
    this.baseColor = new Phaser.Display.Color().setTo(
      ...COLORS[Math.min(9, this.data.get('multi') - 1)],
    )
    this.bgColor = this.baseColor.clone().brighten(20)
    this.cursorColor = this.baseColor.clone().brighten(50).saturate(40)
    this.cursorErrorColor = this.cursorColor.clone().darken(50).desaturate(50)
    this.map && this.map.render()
    this.marker && this.marker._render()
  }
}
