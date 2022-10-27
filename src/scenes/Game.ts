import * as Phaser from 'phaser';
import Frame = Phaser.Textures.Frame;

export default class Demo extends Phaser.Scene {
  // private paddle: ;
  // private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private ball: any;
  private paddles?: Phaser.Physics.Arcade.Group;
  private paddleObject: {bottom?: Phaser.Physics.Arcade.Body, top?: Phaser.Physics.Arcade.Body} = {};
  private cursors: any;
  constructor() {
    super('GameScene');
  }

  accelerateForward(object: any, acceleration=100, x=false, y=false) {
    if (x) {
      if (object.body.velocity.x >= 0) {
        object.setAccelerationX(acceleration);
      } else {
        object.setAccelerationX(-acceleration);
      }
    }
    if (y) {
      if (object.body.velocity.y >= 0) {
        object.setAccelerationY(acceleration);
      } else {
        object.setAccelerationY(-acceleration);
      }
    }
  }

  preload() {
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.paddles = this.physics.add.group()

    this.paddleObject.top = this.paddles.create(40, 40, 'paddle', )
    this.paddleObject.bottom = this.paddles.create(40, 560, 'paddle')
    this.paddles.children.iterate((c: any) => {
      c.setTintFill(0xffffff)
      .setDisplaySize(160, 20)
      .setCollideWorldBounds(true)
      .setPushable(false)
      .setBounce(0.5)
    })

    this.ball = this.physics.add.image(20, 20, 'ball')
    this.ball.setTintFill(0xffffff)
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1)

    this.physics.add.collider(this.paddles, this.ball)

    let ballSpeed
    this.ball.setVelocityX(140)
    this.ball.setVelocityY(140)
  }

  update() {
    const paddleAccel = 1000;

   if (this.cursors.up.isDown) {
     this.accelerateForward(this.paddleObject.top,paddleAccel, true)
    } else {
     this.paddleObject.top?.setAccelerationX(0);
    }
    if (this.cursors.down.isDown) {
      this.accelerateForward(this.paddleObject.bottom,paddleAccel, true)
    } else {
      this.paddleObject.bottom?.setAccelerationX(0);
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
