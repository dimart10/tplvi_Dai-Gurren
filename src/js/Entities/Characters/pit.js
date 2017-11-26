//pit.js
var entity = require('../entity.js');

function pit(game, x, y, name){
  entity.call(this, game, x, y, name);
  game.physics.p2.enable(this);
  this.body.fixedRotation = true;
  this.newAnimation('walk', [21, 22, 23, 24], 5, true, true);

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
  		    this.body.moveLeft(200);
      }
      else if (this.cursors.right.isDown)
      {
  		    this.body.moveRight(200);
      }
      else this.body.velocity.x = 0;
}

module.exports = pit;
