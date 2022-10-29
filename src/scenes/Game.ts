import * as Phaser from 'phaser';
import config from '../config';
import Frame = Phaser.Textures.Frame;

export default class Demo extends Phaser.Scene {
  private ball: any;
  private corners: any;
  private gameOver = false;
  private paddles?: Phaser.Physics.Arcade.Group;
  private paddleObject: {[key: string]: Phaser.Physics.Arcade.Body} = {};
  private paddleHeight = 20;
  private paddleWidth = 160;
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

    // paddles
    this.paddles = this.physics.add.group()
    const paddleOffset = 40

    this.paddleObject.top = this.paddles
      .create(config.scale.width/2, paddleOffset, 'paddle', )
      .setDisplaySize(this.paddleWidth, this.paddleHeight)
    this.paddleObject.bottom = this.paddles
      .create(config.scale.width/2, config.scale.height - paddleOffset, 'paddle')
      .setDisplaySize(this.paddleWidth, this.paddleHeight)
    this.paddleObject.left = this.paddles
      .create(paddleOffset, config.scale.width, 'paddle')
      .setDisplaySize(this.paddleHeight, config.scale.height)
    this.paddleObject.right = this.paddles
      .create(config.scale.width - paddleOffset, config.scale.width, 'paddle')
      .setDisplaySize(this.paddleHeight, config.scale.height)

    this.paddles.children.iterate((c: any) => {
      c.setTintFill(0xffffff)
      .setCollideWorldBounds(true)
      .setPushable(false)
      .setBounce(0.5)
    })

    // ball
    this.ball = this.physics.add.image(80, 80, 'ball')
    this.ball.setTintFill(0xffffff)
    this.ball.setCollideWorldBounds(true);
    this.ball.body.onWorldBounds = true;
    this.ball.setBounce(1)

    this.physics.add.collider(this.paddles, this.ball)

    let ballSpeed
    this.ball.setVelocityX(140)
    this.ball.setVelocityY(140)

    // corners
    const cornerSize = 50
    this.corners = this.physics.add.staticGroup()
    this.corners.add(new Phaser.GameObjects.Rectangle(this, cornerSize/2, cornerSize/2, cornerSize, cornerSize, 0xfffffff), true)
    this.corners.add(new Phaser.GameObjects.Rectangle(this, config.scale.width - cornerSize/2, cornerSize/2, cornerSize, cornerSize, 0xfffffff), true)
    this.corners.add(new Phaser.GameObjects.Rectangle(this, cornerSize/2, config.scale.height - cornerSize/2, cornerSize, cornerSize, 0xfffffff), true)
    this.corners.add(new Phaser.GameObjects.Rectangle(this, config.scale.width - cornerSize/2, config.scale.height - cornerSize/2, cornerSize, cornerSize, 0xfffffff), true)
    this.physics.add.collider(this.corners, this.paddles)

    // endgame conditions
    const endGame = () => {
      this.physics.pause();

      this.ball.setTintFill(0xff0000);

      this.gameOver = true;
    }
    this.physics.world.on('worldbounds', endGame);
  }

  update() {
    const paddleAccel = 1000;

    // paddle controls
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
  }
}
