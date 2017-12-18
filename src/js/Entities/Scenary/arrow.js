//arrow.js
'use strict'

var entity = require('../entity.js');

function arrow(game, x, y, name, direction){
  this.direction = direction;
  this.attackDamage=1;

  if(this.direction==1){
    entity.call(this, game, x+25, y, name);
    this.initialPosition = x;
  }
  else if (this.direction==-1){
    entity.call(this, game, x-25, y, name);
    this.initialPosition = x;
  }
  else if (this.direction==0){
    entity.call(this, game, x, y-35, name);
    this.initialPosition = y;
  }
  else if(this.direction==2){
    entity.call(this, game, x, y, name);
    this.initialPosition = y;
  }

  this.maximumDistance = 220;

  game.physics.arcade.enable(this);
  this.body.allowGravity = false;

  if(direction==0) this.angle=-90;
  else if(direction==-1) this.angle=180;
}

arrow.prototype = Object.create(entity.prototype);

arrow.prototype.update = function(){
  this.move();
  this.cycleOfLife();
}

arrow.prototype.move = function(){
  if (this.direction == 1) this.body.velocity.x = 900;
  else if(this.direction==-1) this.body.velocity.x = -900;
  else if(this.direction==0) this.body.velocity.y = -900;
  else if (this.direction==2) this.body.velocity.y = 900;
}

arrow.prototype.cycleOfLife = function(){
  var currentPosition;
  if (this.direction == 1 || this.direction == -1){
    currentPosition = this.x;
  } else{
    currentPosition = this.y;
  }
  if (Math.abs(currentPosition - this.initialPosition) >= this.maximumDistance)
    this.kill();

  if(this.counter > 75) this.kill();
}

module.exports = arrow;
