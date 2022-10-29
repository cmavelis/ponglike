import Phaser from 'phaser'

export default {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#303030',
  physics: {
    default: 'arcade',
  },
  scale: {
    width: 800,
    height: 600,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
}
