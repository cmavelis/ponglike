import * as Phaser from 'phaser'
import config from '../config'
import Frame = Phaser.Textures.Frame

export default class Demo extends Phaser.Scene {
  // game objects
  private ball: any
  private corners: any
  private walls: any
  private paddles!: Phaser.Physics.Arcade.Group
  private paddleObject: { [key: string]: Phaser.Physics.Arcade.Body } = {}
  private paddleHeight = 20
  private paddleWidth = 160

  // meta
  private cursors: any
  private score: number = 0
  private scoreText!: Phaser.GameObjects.Text
  private gameOver = false
  private announcementText!: Phaser.GameObjects.Text

  constructor() {
    super('GameScene')
  }

  accelerateForward(object: any, acceleration = 100, x = false, y = false) {
    if (x) {
      if (object.body.velocity.x >= 0) {
        object.setAccelerationX(acceleration)
      } else {
        object.setAccelerationX(-acceleration)
      }
    }
    if (y) {
      if (object.body.velocity.y >= 0) {
        object.setAccelerationY(acceleration)
      } else {
        object.setAccelerationY(-acceleration)
      }
    }
  }

  onBallHit = (object1: Phaser.GameObjects.GameObject, object2: Phaser.GameObjects.GameObject) => {
    [object1, object2].forEach((o) => {
      if (o.name === 'paddle'){
        // @ts-ignore  this line works :shrug:
        o.setScale(o._scaleX * 0.9, o._scaleY)
      }
    }
      )
    this.score += 1
    this.scoreText.setText(this.score.toString())
  }

  preload() {}

  create() {
    const cornerSize = 50
    const paddleOffset = 40

    this.cursors = this.input.keyboard.createCursorKeys()

    // paddles
    this.paddles = this.physics.add.group()
    this.paddleObject.top = this.paddles
      .create(config.scale.width / 2, paddleOffset, 'paddle')
      .setDisplaySize(this.paddleWidth, this.paddleHeight)
    this.paddleObject.bottom = this.paddles
      .create(
        config.scale.width / 2,
        config.scale.height - paddleOffset,
        'paddle'
      )
      .setDisplaySize(this.paddleWidth, this.paddleHeight)
    // // removing paddles for demo
    // this.paddleObject.left = this.paddles
    //   .create(paddleOffset, config.scale.width, 'paddle')
    //   .setDisplaySize(this.paddleHeight, this.newPaddleWidth)
    // this.paddleObject.right = this.paddles
    //   .create(config.scale.width - paddleOffset, config.scale.width, 'paddle')
    //   .setDisplaySize(this.paddleHeight, this.newPaddleWidth)

    this.paddles.children.iterate((c: any) => {
      c.setTintFill(0xffffff)
        .setCollideWorldBounds(true)
        .setPushable(false)
        .setBounce(0.5)
        .setName('paddle')
    })

    // ball
    this.ball = this.physics.add.image(80, 80, 'ball')
    this.ball.setTintFill(0xffffff)
    this.ball.setCollideWorldBounds(true)
    this.ball.body.onWorldBounds = true
    this.ball.setBounce(1).setName('ball')

    this.physics.add.collider(this.paddles, this.ball, this.onBallHit)

    let ballSpeed
    this.ball.setVelocityX(140)
    this.ball.setVelocityY(140)

    // corners
    this.corners = this.physics.add.staticGroup()
    this.corners.add(
      new Phaser.GameObjects.Rectangle(
        this,
        cornerSize / 2,
        cornerSize / 2,
        cornerSize,
        cornerSize,
        0xfffffff
      ),
      true
    )
    this.corners.add(
      new Phaser.GameObjects.Rectangle(
        this,
        config.scale.width - cornerSize / 2,
        cornerSize / 2,
        cornerSize,
        cornerSize,
        0xfffffff
      ),
      true
    )
    this.corners.add(
      new Phaser.GameObjects.Rectangle(
        this,
        cornerSize / 2,
        config.scale.height - cornerSize / 2,
        cornerSize,
        cornerSize,
        0xfffffff
      ),
      true
    )
    this.corners.add(
      new Phaser.GameObjects.Rectangle(
        this,
        config.scale.width - cornerSize / 2,
        config.scale.height - cornerSize / 2,
        cornerSize,
        cornerSize,
        0xfffffff
      ),
      true
    )
    this.physics.add.collider(this.corners, this.paddles)

    //walls
    this.walls = this.physics.add.staticGroup()
    this.walls.add(
      new Phaser.GameObjects.Rectangle(
        this,
        cornerSize / 2,
        config.scale.height / 2,
        cornerSize,
        config.scale.height,
        0xfffffff
      ),
      true
    )
    this.walls.add(
      new Phaser.GameObjects.Rectangle(
        this,
        config.scale.width - cornerSize / 2,
        config.scale.height / 2,
        cornerSize,
        config.scale.height,
        0xfffffff
      ),
      true
    )
    this.physics.add.collider(this.walls, this.ball)

    this.scoreText = this.add.text(10, 10, '0', {
      color: '#ff0000',
      fontSize: '32px',
    })
    this.announcementText = this.add.text(
      config.scale.width / 2,
      config.scale.height / 2,
      '',
      { color: '#fff', fontSize: '32px' }
    ).setOrigin(0.5)

    // endgame conditions
    const endGame = () => {
      this.physics.pause()

      this.ball.setTintFill(0xff0000)

      this.gameOver = true
    }
    this.physics.world.on('worldbounds', endGame)
  }

  update() {
    const paddleAccel = 1000

    // paddle controls
    if (this.cursors.up.isDown) {
      this.accelerateForward(this.paddleObject.top, paddleAccel, true)
    } else {
      this.paddleObject.top?.setAccelerationX(0)
    }
    if (this.cursors.down.isDown) {
      this.accelerateForward(this.paddleObject.bottom, paddleAccel, true)
    } else {
      this.paddleObject.bottom?.setAccelerationX(0)
    }

    // // use this to delete the walls and expose extra paddles
    // if (this.score === 2) {
    //   this.walls.clear(true)
    // }

    // game over
    if (this.gameOver) {
      this.announcementText.setText('GAME OVER\nREFRESH TO RETRY')
    }   
  }
}
