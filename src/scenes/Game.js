import Map from '../gameObjects/map'
import UI from '../gameObjects/ui'
import Marker from '../gameObjects/marker'
import {
  TIME_OUT_DURATION,
  TICK,
  TIMER_DURATION,
  EXPLODE_ANIM_DELAY,
  EXTRA_LIVES_SCORE,
  SCORE_TO_LEVEL,
  COLORS,
  LINE_ANIM_DURATION,
} from '../constants'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init(data) {
    this.data.set('targetLevel', data.difficultyIndex)
  }

  create() {
    this.cameras.main.fadeFrom(1000, 0, 0, 0, true)
    this.data.set('minosPlaced', 0)
    this.data.set('score', 0)
    this.data.set('loops', 0)
    this.data.set('lives', 3)
    this.data.set('level', 1)
    this.data.set('timerMax', TIMER_DURATION)
    this.data.set('timer', TIMER_DURATION)

    this.updateColor()

    this.map = new Map(this)
    this.ui = new UI(this)
    this.marker = new Marker(this)

    this.input.keyboard.removeAllKeys(true)
    this.keys = this.input.keyboard.addKeys(
      'W,A,S,D,Q,E,R,M,F,G,UP,DOWN,LEFT,RIGHT,Z,X,C,SPACE',
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
    this.keys.M.on('down', this.mute)
    this.keys.F.on('down', this.fullscreen)
    this.keys.G.on('down', this.map.toggleEffects)

    this.game.events.on('up-button', this.marker.moveUp)
    this.game.events.on('down-button', this.marker.moveDown)
    this.game.events.on('left-button', this.marker.moveLeft)
    this.game.events.on('right-button', this.marker.moveRight)
    this.game.events.on('a-button', this.placeMino)
    this.game.events.on('b-button', this.marker.rotateRight)
    this.game.events.on('c-button', this.marker.hold)

    this.keys.SPACE.on('down', this.placeMino)

    this.time.addEvent({ delay: TICK, repeat: -1, callback: this.tick })
    this.time.addEvent({ delay: 1000, callback: this.nextMino })
    this.time.addEvent({
      delay: 1000,
      callback: () => this.checkLevel(this.data.get('targetLevel')),
    })

    this.particles = this.add.particles('spark').setDepth(20)
    this.emitter = this.particles
      .createEmitter({
        speed: { min: -30, max: 30 },
        angle: { min: 0, max: 360 },
        alpha: { start: 0.5, end: 0 },
        lifespan: { max: 800, min: 300 },
      })
      .stop()
    this.givenExtraLives = []
    this._visibilityChange()
  }

  tick = () => {
    const timer = this.data.get('timer')
    if (this.marker.mino) {
      // TODO: make constant for timer tick logic
      if (timer && timer <= 3000 && timer % 1000 === 0) {
        this.sound.play('move', {
          volume: (4000 - timer) / 4000,
          rate: 0.6 - (4000 - timer) / 15000,
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
    const newTimerMax = TIMER_DURATION - (this.data.get('level') - 1) * 1000
    this.data.set('timerMax', newTimerMax)
    this.updateColor()
    this.marker.clear()

    this.map.clearBoard()

    this.sound.play('timeout', { volume: 0.5 })

    this.emitter.setPosition(
      this.marker.container.x + 7,
      this.marker.container.y + 7,
    )
    this.emitter.setTint(this.cursorColor.color)
    this.emitter.explode(100)

    this.updateLives(-1)

    this.time.addEvent({ delay: TIME_OUT_DURATION, callback: this.nextMino })
    this.cameras.main.shake(100)

    if (this.data.get('lives') < 0) {
      this.registry.set('score', this.data.get('score'))
      this.game.events.off('up-button')
      this.game.events.off('down-button')
      this.game.events.off('left-button')
      this.game.events.off('right-button')
      this.game.events.off('a-button')
      this.game.events.off('b-button')
      this.game.events.off('c-button')
      this.scene.start('Menu')
    }
  }

  placeMino = () => {
    if (!this.marker.placeMino()) return

    this.sound.play('click', { volume: 0.2 })
    this.data.set('minosPlaced', this.data.get('minosPlaced') + 1)
    const level = this.data.get('level')

    const loop = this.map.clearLoop() || []

    const numCorners = loop.filter((t) => [4, 5, 6, 7].includes(t.index))
    // TODO: make constant for score multiplier
    const score =
      loop.length * (numCorners.length + 1) * 10 * Math.ceil(level / 3)

    // TODO: make constant for 0.03 * level
    loop.length > 0 && this.sound.play('loop', { rate: 0.7 + 0.03 * level })
    const lineAnimDelay = LINE_ANIM_DURATION - 70 * level
    // TODO: make constant for 2 * level
    const loopAnimDelay = loop.length * (EXPLODE_ANIM_DELAY - 2 * level)
    // TODO: make constant for 25 * level
    const minoDelay = 250 - 25 * level
    this.time.addEvent({
      delay: loop.length > 1 ? lineAnimDelay + loopAnimDelay : 0,
      callback: () => {
        this.time.addEvent({ delay: minoDelay, callback: this.nextMino })

        this.addScore(score)
      },
    })
  }

  addScore = (increase) => {
    if (increase === 0) return

    const newScore = +this.data.get('score') + increase
    this.data.set('score', newScore)
    this.ui.setPointText(increase)

    const score = +this.data.get('score')

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        const extraLivesCount = Math.floor(score / EXTRA_LIVES_SCORE)
        if (extraLivesCount > 0 && !this.givenExtraLives[extraLivesCount]) {
          this.givenExtraLives[extraLivesCount] = true
          this.sound.play('life')
          this.updateLives(1)
        }
      },
    })

    this.checkLevel()
  }

  checkLevel = (forceLevel) => {
    const hasEnoughScoreToLevel =
      this.data.get('score') >= SCORE_TO_LEVEL[this.data.get('level')]

    if (
      (forceLevel || hasEnoughScoreToLevel) &&
      (!forceLevel || this.data.get('level') < forceLevel) &&
      this.data.get('level') < 9
    ) {
      const levelDelay = 1000 // - 40 * this.data.get('level')
      this.time.addEvent({
        delay: levelDelay,
        callback: () => this.checkLevel(forceLevel),
      })
      this.time.addEvent({
        delay: 100,
        callback: () => {
          const level = this.data.get('level')
          this.sound.play(`multi${Math.min(6, level)}`, {
            rate: 0.7 + (level - 1) * 0.1,
          })
          this.data.set('level', level + 1)
          this.updateColor()
          this.marker.resetQueue()
          this.ui._drawInterface()
          const color = this.bgColor.clone()
          color.darken(70)
          this.cameras.main.flash(
            levelDelay - 100,
            color.red,
            color.green,
            color.blue,
          )
          const newTimerMax =
            TIMER_DURATION - (this.data.get('level') - 1) * 1000
          this.data.set('timerMax', newTimerMax)
          this.data.set('timer', this.data.get('timerMax'))
        },
      })
    }
  }

  updateLives = (value) =>
    this.data.set('lives', Math.min(10, this.data.get('lives') + value))

  updateColor = () => {
    this.baseColor = new Phaser.Display.Color().setTo(
      ...COLORS[Math.min(9, this.data.get('level') - 1)],
    )
    this.bgColor = this.baseColor.clone().brighten(20)
    this.cursorColor = this.baseColor.clone().brighten(30).saturate(30)
    this.cursorErrorColor = this.cursorColor.clone().brighten(100)
    this.cursorErrorColor._h + 0.2
    this.cursorErrorColor.desaturate(50)
    this.map && this.map.render()
    this.marker && this.marker._render()
  }

  mute = () => {
    this.game.sound.mute = this.game.sound.mute ? false : true
  }

  fullscreen = () => {
    if (this.scale.isFullscreen) {
      this.scale.stopFullscreen()
    } else {
      this.scale.startFullscreen()
    }
  }

  _visibilityChange = () => {
    var hidden, visibilityChange
    if (typeof document.hidden !== 'undefined') {
      hidden = 'hidden'
      visibilityChange = 'visibilitychange'
    } else if (typeof document.msHidden !== 'undefined') {
      hidden = 'msHidden'
      visibilityChange = 'msvisibilitychange'
    } else if (typeof document.webkitHidden !== 'undefined') {
      hidden = 'webkitHidden'
      visibilityChange = 'webkitvisibilitychange'
    }

    document.addEventListener(
      visibilityChange,
      () => {
        if (document[hidden]) {
          this.scene.pause()
        } else {
          this.scene.resume()
        }
      },
      false,
    )
  }
}
