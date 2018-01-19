//arrow.js
'use strict'

var entity = require('../entity.js');
var config = require('../../config.js')

function arrow(game, x, y, name, direction){
  this.direction = direction;
  this.attackDamage=config.arrowAttackDamage;

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

  this.maximumDistance = config.arrowDistance;

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

//the arrow moves depending on its direction
arrow.prototype.move = function(){
  if (this.direction == 1) this.body.velocity.x = config.arrowVelocity;
  else if(this.direction==-1) this.body.velocity.x = -config.arrowVelocity;
  else if(this.direction==0) this.body.velocity.y = -config.arrowVelocity;
  else if (this.direction==2) this.body.velocity.y = config.arrowVelocity;
}

//The arrow is destroyed after traveling a certain distance
arrow.prototype.cycleOfLife = function(){
  var currentPosition;
  if (this.direction == 1 || this.direction == -1){
    currentPosition = this.x;
  } else{
    currentPosition = this.y;
  }
  if (Math.abs(currentPosition - this.initialPosition) >= this.maximumDistance)
    this.kill();
}

//When the arrow hits an enemy it deals damage and is destroyed
//if the sacredBow is not equiped
arrow.prototype.onHit = function(){
  var damage = this.attackDamage + this.game.bonusDamage;
  if(!this.game.hasSacredBow) this.destroy();
  
  return damage;
}

module.exports = arrow;
