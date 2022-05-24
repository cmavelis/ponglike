import Phaser from 'phaser';
import Frame = Phaser.Textures.Frame;

export default class Demo extends Phaser.Scene {
  // private paddle: ;
  // private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private ball: any;
  private paddle: any;
  private cursors: any;
  constructor() {
    super('GameScene');
    // this.paddle = this.physics.add.image(40, 40, 'paddle')
  }

  preload() {
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.paddle = this.physics.add.image(40, 40, 'paddle')
    this.paddle.setTintFill(0xffffff).setDisplaySize(160, 20)
    this.paddle.setCollideWorldBounds(true);
    this.paddle.setPushable(false)
    this.paddle.setBounce(0.5)


    this.ball = this.physics.add.image(20, 20, 'ball')
    this.ball.setTintFill(0xffffff)
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1)

    this.physics.add.collider(this.paddle, this.ball)

    let ballSpeed
    this.ball.setVelocityX(140)
    this.ball.setVelocityY(140)
  }

  update() {

    const moveVelocity = 1000;
    if (this.cursors.left.isDown) {
      this.paddle.setAccelerationX(-moveVelocity);
    } else if (this.cursors.right.isDown) {
      this.paddle.setAccelerationX(moveVelocity);
    } else {
      this.paddle.setAccelerationX(0);
    }
    // if (this.cursors.up.isDown)
    // {
    //   this.paddle.setVelocityY(-moveVelocity);
    // }
    // if (this.cursors.down.isDown)
    // {
    //   this.paddle.setVelocityY(moveVelocity);
    // }
  }
}
