//pit.js
var entity = require('../entity.js');

function pit(game, x, y, name){
  entity.call(this, game, x, y, name);
  game.camera.follow(this);
  
  this.scale.setTo(3.12, 3.12);
  game.physics.p2.enable(this);
  this.body.fixedRotation = true;

  this.newAnimation('stillRight', [7], 0, false, true);
  this.newAnimation('stillLeft', [6], 0, false, false);
  this.newAnimation('walkRight', [10, 9, 8, 7], 15, true, false);
  this.newAnimation('walkLeft', [3, 4, 5, 6], 15, true, false);

  this.cursors = game.input.keyboard.createCursorKeys(); //TESTING
}

pit.prototype = Object.create(entity.prototype); //Inherits from entity

pit.prototype.newAnimation = function (name, frames, fps, repeat, playOnCreate){
  this.animations.add(name, frames, fps, repeat);
  if (playOnCreate) this.animations.play(name);
}

pit.prototype.update = function(){
  this.move();
}

pit.prototype.move = function(){ //TESTING
  if (this.cursors.left.isDown) {
  		    this.body.moveLeft(150);
          this.animations.play("walkLeft");
      }
      else if (this.cursors.right.isDown)
      {
  		    this.body.moveRight(150);
          this.animations.play("walkRight");
      }
      else{
        this.body.velocity.x = 0;
        if (this.animations.name == "walkRight") this.animations.play("stillRight");
        else if (this.animations.name == "walkLeft") this.animations.play("stillLeft");
      }
}

module.exports = pit;
