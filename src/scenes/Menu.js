import Background from '../gameObjects/background'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' })
  }

  init() {}

  create() {
    this.background = new Background(this)
    this.keys = this.input.keyboard.addKeys(
      'W,A,S,D,M,SPACE,UP,DOWN,LEFT,RIGHT',
    )
    this.keys.SPACE.on('down', this.selectOption)
    this.keys.W.on('down', this.lastOption)
    this.keys.S.on('down', this.nextOption)
    this.keys.A.on('down', this.easierDifficulty)
    this.keys.D.on('down', this.harderDifficulty)
    this.keys.UP.on('down', this.lastOption)
    this.keys.DOWN.on('down', this.nextOption)
    this.keys.LEFT.on('down', this.easierDifficulty)
    this.keys.RIGHT.on('down', this.harderDifficulty)
    this.keys.M.on('down', this.mute)

    this.game.events.on('up-button', this.nextOption)
    this.game.events.on('down-button', this.lastOption)
    this.game.events.on('a-button', this.selectOption)
    this.game.events.on('b-button', this.selectOption)

    this.musicObject = this.sound.add('menuMusic')
    this.musicObject.play({ volume: 0.5, loop: true })
    this.started = false

    this.optionIndex = 0
    this.difficultyIndex = 1

    this.add.image(32, 16, 'title').setOrigin(0.5)
    this.add.bitmapText(32, 51, 'pixel-dan', 'START', 5).setOrigin(0.5)
    this.difficultyText = this.add
      .bitmapText(46, 51, 'pixel-dan', '1', 5)
      .setAlpha(0.5)
      .setOrigin(0.5)
    this.add.bitmapText(32, 59, 'pixel-dan', 'HELP', 5).setOrigin(0.5)
    this.arrow = this.add.graphics()
    this.arrow.fillStyle(0xffffff)

    this.setOption(false)

    const score = this.registry.get('score')
    if (score) {
      this.optionIndex = 0

      this.add
        .bitmapText(32, 40, 'pixel-dan', `SCORE ${score}`, 5)
        .setOrigin(0.5)
        .setDepth(10)
    }

    this.time.addEvent({
      repeat: -1,
      delay: 1000,
      callback: () => {
        this.spaceText &&
          this.spaceText.setAlpha(this.spaceText.alpha === 0.6 ? 1 : 0.6)
      },
    })
  }

  lastOption = () => {
    this.optionIndex--
    this.setOption()
  }

  nextOption = () => {
    this.optionIndex++
    this.setOption()
  }

  setOption = (sound = true) => {
    if (this.registry.get('inHelp') || this.started) return
    this.arrow.clear()
    sound && this.sound.play('click')
    if (this.optionIndex < 0) this.optionIndex = 1
    if (this.optionIndex > 1) this.optionIndex = 0
    this.arrow
      .fillStyle(0xffffff)
      .fillRect(17, 48 + 8 * this.optionIndex, 2, 3)
      .fillRect(19, 49 + 8 * this.optionIndex, 1, 1)
  }

  selectOption = () => {
    if (this.registry.get('inHelp') || this.started) return
    if (this.optionIndex === 0) {
      this.sound.play('start')
      this.tweens.add({
        targets: this.musicObject,
        duration: 1900,
        volume: 0,
      })
      this.started = true
      this.cameras.main.fade(2000, 0, 0, 0, true, (c, p) => {
        if (p === 1) {
          this.game.events.off('up-button')
          this.game.events.off('down-button')
          this.game.events.off('a-button')
          this.game.events.off('b-button')
          this.scene.start('Game', { difficultyIndex: this.difficultyIndex })
          this.musicObject.destroy()
        }
      })
    }
    if (this.optionIndex === 1) {
      this.scene.launch('Help', { startIndex: this.background.colorIndex })
      this.registry.set('inHelp', true)
    }
  }

  easierDifficulty = () => {
    this.difficultyIndex--
    if (this.difficultyIndex < 1) this.difficultyIndex = 1
    this.difficultyText.text = this.difficultyIndex
  }

  harderDifficulty = () => {
    this.difficultyIndex++
    if (this.difficultyIndex > 9) this.difficultyIndex = 9
    this.difficultyText.text = this.difficultyIndex
  }

  mute = () => {
    this.game.sound.mute = this.game.sound.mute ? false : true
  }

  update() {}
}
