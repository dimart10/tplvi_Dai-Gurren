//magmaShot.js
'use strict'

var entity = require('../entity.js');
var config = require('../../config.js');

function magmaShot(game, x, y, name, direction){
  this.direction = direction;
  this.attackDamage = config.magmaShotAttackDamage;

  if(this.direction==1){
    entity.call(this, game, x + config.magmaShotOffset, y, name);
    this.initialPosition = x;
  }
  else if (this.direction==-1){
    entity.call(this, game, x - config.magmaShotOffset, y, name);
    this.initialPosition = x;
  }

  game.physics.arcade.enable(this);
  this.body.allowGravity = false;

}

magmaShot.prototype = Object.create(entity.prototype);

magmaShot.prototype.update = function(){
  this.move();
  this.cycleOfLife();
}

//moves in its direction
magmaShot.prototype.move = function(){
  if (this.direction == 1) this.body.velocity.x = config.magmaShotVelocity;
  else if(this.direction==-1) this.body.velocity.x = -config.magmaShotVelocity;
}

//dissapears after traveling a certain distance
magmaShot.prototype.cycleOfLife = function(){
  var currentPosition;
  if (this.direction == 1 || this.direction == -1){
    currentPosition = this.x;
  } else{
    currentPosition = this.y;
  }
  if (Math.abs(currentPosition - this.initialPosition) >= config.magmaShotDistance)
    this.kill();
}

module.exports = magmaShot;
