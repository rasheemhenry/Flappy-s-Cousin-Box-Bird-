var mainState = {

        preload: function() {
              //Is excecuted at the beginning, and loads images/sounds
              //Our bird
              game.load.image( 'bird', 'assets/bird.png');

              //loading in the pipe image
              game.load.image( 'pipe', 'assets/pipe.png');

              //Sound
              game.load.audio('jump', 'assets/jump.wav');

        },

        create: function() {
              //Called after preload, and where we throw in sprites
              //Background color of the game will be blue
              game.stage.backgroundColor = '#71c5cf';

              //Arcade Physics
              game.physics.startSystem(Phaser.Physics.ARCADE);

              //Bird will beign at this position
              this.bird = game.add.sprite(100, 245, 'bird');

              //Physics to the bird
              game.physics.arcade.enable(this.bird);

              //Gravity to the bird/falling
              this.bird.body.gravity.y = 1000;

              //Calling jump
              var spaceKey = game.input.keyboard.addKey (Phaser.Keyboard.SPACEBAR);
              spaceKey.onDown.add(this.jump, this);

              // Groups for to hold all of our pipes
              this.pipes = game.add.group();

              //Timer for pipes to trigger/move
              this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

              //Score top left
              this.score = 0;
              this.lableScore = game.add.text(20, 20, "0", 
                  { font: "30px Arial", fill: "#ffffff"});

              //new anchor of bird's rotation
              this.bird.anchor.setTo(-0.2, 0.5);

              //adding sound to jump
              this.jumpSound = game.add.audio('jump');

        },

        update: function() {
              //The game's logic; called rapidly per second
              //restart game if the 'bird' is outside of the world
              if (this.bird.y < 0 || this.bird.y > 490)
              this.restartGame();

              //'bird' tilt
              if (this.bird.angle <  20)
                    this.bird.angle += 1;

              //new collision bird hitting and falling instead of auto restarting
              game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

        },

       jump: function() {

              if (this.bird.alive == false)
                  return;

              //Vertical velocity to 'bird'/jump
              this.bird.body.velocity.y = -350;

              //animation on the bird after jumping
              var animation = game.add.tween(this.bird);

              animation.to({angle: -20}, 100);

              animation.start();

              this.jumpSound.play();
       },

       restartGame: function() {
              //Start the 'main' state
              game.state.start('main');
       },

       addOnePipe: function(x, y) {
              //pipe at x,y
              var pipe = game.add.sprite(x, y, 'pipe');

              //Add the pipe to our pipe group
              this.pipes.add(pipe);

              //Physics on the pipe
              game.physics.arcade.enable(pipe);

              //Velocity to the pipe
              pipe.body.velocity.x = -200;

              // Kill pipes as they move off screen
              pipe.checkWorldBounds = true;
              pipe.outOfBoundsKill = true;
       },

       addRowOfPipes: function() {
              //Randomly picking a number 1-5 for out hole position
              var hole = Math.floor(Math.random() * 5) + 1;

              // The 6 other pipes
              //Only 6 as the other two spots will be our hole
              for (var i = 0; i < 8; i++)
                  if (i != hole && i != hole + 1)
                      this.addOnePipe(400, i * 60 + 10);

              //+1 score for pipes created
              this.score += 1;
              this.lableScore.text = this.score;
       },

       hitPipe: function() {
        if (this.bird.alive == false)
              return;

        this.bird.alive = false;

        game.time.events.remove(this.timer);

        this.pipes.forEach(function(p) {
              p.body.velocity.x = 0;
            }, this);
       },
};

//Initialize Phaser, and create the world for the game
var game = new Phaser.Game(400, 490);

//adding the 'mainState'
game.state.add( 'main' , mainState);

//Starting the game
game.state.start( 'main' );