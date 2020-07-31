export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' })
  }

  preload() {
    const progress = this.add.graphics()

    window.isMuted = !!Number(localStorage.getItem('mute'))
    this.sound.mute = window.isMuted

    this.load.on('progress', (value) => {
      progress.clear()
      progress.fillStyle(0xffffff, 1)
      progress.fillRect(
        0,
        this.sys.game.config.height / 2,
        this.sys.game.config.width * value,
        60,
      )
    })

    // this.load.audio('menuMusic', 'assets/audio/menu-music.mp3')
    // this.load.audio('gameMusic', 'assets/audio/game-music.mp3')
    // this.load.audio('coin', 'assets/audio/coin.mp3', { instances: 5 })

    // this.load.spritesheet('icon', 'assets/images/icons.png', {
    //   frameWidth: 100,
    //   frameHeight: 100,
    // })

    this.load.on('complete', () => {
      progress.destroy()
      this.scene.start('Game')
    })
  }
}
