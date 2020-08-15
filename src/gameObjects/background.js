import { COLORS } from '../constants'

export default class Background {
  constructor(scene, startIndex = 0) {
    scene.add.shader('Tunnel', 32, 32, 64, 64, ['metal'])
    this.graphics = scene.add.graphics()
    this.scene = scene
    this.colorIndex = startIndex
    this.nextColor()
  }

  nextColor = () => {
    const nextIndex = (this.colorIndex + 1) % COLORS.length
    this.fromColor = new Phaser.Display.Color().setTo(
      ...COLORS[this.colorIndex],
    )
    this.toColor = new Phaser.Display.Color().setTo(...COLORS[nextIndex])
    this.colorIndex = nextIndex
    this.tweenBg()
  }

  tweenBg = () => {
    let tween = this.scene.tweens.addCounter({
      from: 0,
      to: 100,
      duration: 5000,
      onUpdate: () => {
        var tint = Phaser.Display.Color.Interpolate.ColorWithColor(
          this.fromColor,
          this.toColor,
          100,
          tween.getValue(),
        )
        this.graphics
          .clear()
          .fillStyle(Phaser.Display.Color.ObjectToColor(tint).color, 0.7)
          .fillRect(0, 0, 64, 64)
          .fillStyle(0x000, 0.6)
          .fillRect(0, 0, 64, 64)
      },
      onComplete: this.nextColor,
    })
  }
}
