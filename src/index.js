import Phaser from 'phaser'
import * as scenes from './scenes'

var config = {
  type: Phaser.AUTO,
  width: 64,
  height: 64,
  backgroundColor: '#000',
  pixelArt: true,
  zoom: 4,
  parent: 'phaser-example',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // debug: true,
  scene: Object.values(scenes),
}

window.game = new Phaser.Game(config)
