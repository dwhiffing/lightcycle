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
      progress.fillRect(0, 0, 64 * value, 64)
    })

    this.load.audio('menuMusic', 'assets/audio/menu-music.mp3')
    // this.load.audio('gameMusic', 'assets/audio/game-music.mp3')
    this.load.audio('move', 'assets/audio/help-next.mp3', { instances: 5 })
    this.load.audio('click', 'assets/audio/click.mp3', { instances: 5 })
    this.load.audio('error', 'assets/audio/error.mp3', { instances: 5 })
    this.load.audio('start', 'assets/audio/start.mp3')
    this.load.audio('loop', 'assets/audio/start4.mp3')
    this.load.audio('life', 'assets/audio/life.mp3')
    this.load.audio('hold', 'assets/audio/hold.mp3')
    this.load.audio('timeout', 'assets/audio/timeout.mp3')
    this.load.audio('place1', 'assets/audio/place1.mp3', { instances: 5 })
    this.load.audio('place2', 'assets/audio/place2.mp3', { instances: 5 })
    this.load.audio('place3', 'assets/audio/place3.mp3', { instances: 5 })
    this.load.audio('place4', 'assets/audio/place4.mp3', { instances: 5 })
    this.load.audio('place5', 'assets/audio/place5.mp3', { instances: 5 })
    this.load.audio('place6', 'assets/audio/place6.mp3', { instances: 5 })
    this.load.audio('place7', 'assets/audio/place7.mp3', { instances: 5 })

    this.load.audio('multi1', 'assets/audio/multi1.mp3', { instances: 5 })
    this.load.audio('multi2', 'assets/audio/multi2.mp3', { instances: 5 })
    this.load.audio('multi3', 'assets/audio/multi3.mp3', { instances: 5 })
    this.load.audio('multi4', 'assets/audio/multi4.mp3', { instances: 5 })
    this.load.audio('multi5', 'assets/audio/multi5.mp3', { instances: 5 })
    this.load.audio('multi6', 'assets/audio/multi6.mp3', { instances: 5 })

    this.load.bitmapFont(
      'pixel-dan',
      'assets/pixel-dan.png',
      'assets/pixel-dan.xml',
    )

    this.load.spritesheet('tiles', 'assets/images/tiles.png', {
      frameWidth: 5,
      frameHeight: 5,
    })

    this.load.image('spark', 'assets/images/spark.png')
    this.load.image('title', 'assets/images/title.png')
    this.load.image('hud', 'assets/images/hud.png')
    this.load.image('metal', 'assets/images/background.png')
    this.load.glsl('bundle', 'assets/shader.glsl.js')

    this.load.on('complete', () => {
      progress.destroy()
      // this.scene.start('Game')
      this.scene.start('Menu')
    })
  }
}
