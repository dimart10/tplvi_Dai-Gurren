//pit.js
var entity = require('../entity.js');
var arrow = require('../Scenary/arrow.js');

function pit(game, x, y, name){
  entity.call(this, game, x, y, name);
  game.camera.follow(this);

  this.scale.setTo(3.12, 3.12);
  game.physics.p2.enable(this);
  this.body.fixedRotation = true;

  this.body.clearShapes();
  this.body.addRectangle(25, 64);

  this.newAnimation('stillRight', [7], 0, false, true);
  this.newAnimation('stillLeft', [6], 0, false, false);
  this.newAnimation('walkRight', [10, 9, 8, 7], 15, true, false);
  this.newAnimation('walkLeft', [3, 4, 5, 6], 15, true, false);

  this.arrowKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
  this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.cursors = game.input.keyboard.createCursorKeys(); //TESTING

  //PROVISIONAL
  this.game = game;
  this.jumptimer=0;
  this.direction=0;
}

pit.prototype = Object.create(entity.prototype); //Inherits from entity

pit.prototype.newAnimation = function (name, frames, fps, repeat, playOnCreate){
  this.animations.add(name, frames, fps, repeat);
  if (playOnCreate) this.animations.play(name);
}

pit.prototype.update = function(){
  console.log(this.direction);
  this.move();
  this.jump();
  this.shoot();
}

pit.prototype.move = function(){ //TESTING
  if (this.cursors.left.isDown) {
  		    this.body.moveLeft(150);
          this.animations.play("walkLeft");
          this.direction=-1;
      }
      else if (this.cursors.right.isDown)
      {
  		    this.body.moveRight(150);
          this.animations.play("walkRight");
          this.direction=1;
      }
      else{
        this.body.velocity.x = 0;
        if (this.animations.name == "walkRight") this.animations.play("stillRight");
        else if (this.animations.name == "walkLeft") this.animations.play("stillLeft");
      }
}


pit.prototype.jump = function(){

  if(this.spacebar.isDown && this.checkIfCanJump()) {
    this.jumptimer=1;
    this.body.velocity.y = -150;
  }

  else if(this.spacebar.isDown && (this.jumptimer!=0))  {
      if(this.jumptimer > 40){
        this.jumptimer=0;
      }
      else{
        this.jumptimer++;
        this.body.velocity.y=-150;
      }
    }

  else if (this.jumptimer != 0){
    this.jumptimer=0;
  }
}

pit.prototype.shoot = function(){
  if(this.arrowKey.isDown) {
    arrowu = new arrow(this.game, this.position.x, this.position.y, arrow, this.direction);
  }
}







//Method that checks if the player is touching the ground
pit.prototype.checkIfCanJump = function() {
  var c, d, i, result, yAxis;
  yAxis = p2.vec2.fromValues(0, 1);
  result = false; //returned variable, initialized as false
  //Loop that iterates through the collisions in the game
  for (i=0; i < this.game.physics.p2.world.narrowphase.contactEquations.length; i++ ) {
    //Variable c contains the collisions in the i position of the vector
    c = this.game.physics.p2.world.narrowphase.contactEquations[i];
    //If a collisions includes this.body as either of the bodies colliding
    if (c.bodyA === this.body.data || c.bodyB === this.body.data) {
      //D is assigned a position to check if this.body is above or below
      //the other body (this comment needs more work)
      d = p2.vec2.dot(c.normalA, yAxis);
      if (c.bodyA === this.body.data) {
        d *= -1;
      }
      if (d > 0.5) {
        result = true;
      }
    }
  }
  return result;
}

module.exports = pit;
