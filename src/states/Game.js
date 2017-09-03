/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'

export default class extends Phaser.State {

  constructor() {
    super();
    this.platforms;
    this.player;
    this.score = 0;
  }


  init() {
    //this.this.platforms;
  }

  preload() {
    this.game.load.image('sky', 'assets/sky.png');
    this.game.load.image('ground', 'assets/platform.png');
    this.game.load.image('star', 'assets/star.png');
    this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  }

  create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The this.platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    this.platforms.enableBody = true;

    // Here we create the ground.
    var ground = this.platforms.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    let ledge = this.platforms.create(400, 400, 'ground');
     ledge.body.immovable = true;
    ledge = this.platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    this.player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(this.player);
    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 300;
    this.player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Finally some stars to collect
    this.stars = game.add.group();
    this.stars.enableBody = true;

    for (var i = 0; i < 12; i++) {
      var star = this.stars.create(i * 70, 0, 'star');
      star.body.gravity.y = 300;
      star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    this.scoreText = game.add.text(16, 16, 'score: '+this.score, { fontSize: '32px', fill: '#000' });
    this.cursors = game.input.keyboard.createCursorKeys();
  }

  update() {

    //  Collide the this.player and the stars with the this.platforms
    game.physics.arcade.collide(this.player, this.platforms);
    game.physics.arcade.collide(this.stars, this.platforms);

    //  Checks to see if the this.player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);

    //  Reset the this.players velocity (movement)
    this.player.body.velocity.x = 0;

    if (this.cursors.left.isDown) {
      //  Move to the left
      this.player.body.velocity.x = -150;

      this.player.animations.play('left');
    }
    else if (this.cursors.right.isDown) {
      //  Move to the right
      this.player.body.velocity.x = 150;

      this.player.animations.play('right');
    }
    else {
      //  Stand still
      this.player.animations.stop();

      this.player.frame = 4;
    }

    //  Allow the this.player to jump if they are touching the ground.
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -350;
    }
  }

  collectStar(player, star) {

    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    this.score += 10;
    this.scoreText.text = 'Score: ' + this.score;

  }

  render() {
    if (__DEV__) {
      //this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
