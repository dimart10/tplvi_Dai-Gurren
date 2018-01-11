//magmaShot.js
'use strict'

var entity = require('../entity.js');

function magmaShot(game, x, y, name, direction){
  this.direction = direction;
  this.attackDamage=2;

  if(this.direction==1){
    entity.call(this, game, x+10, y, name);
    this.initialPosition = x;
  }
  else if (this.direction==-1){
    entity.call(this, game, x-10, y, name);
    this.initialPosition = x;
  }

  this.maximumDistance = 300;

  game.physics.arcade.enable(this);
  this.body.allowGravity = false;

}

magmaShot.prototype = Object.create(entity.prototype);

magmaShot.prototype.update = function(){
  this.move();
  this.cycleOfLife();
}

magmaShot.prototype.move = function(){
  if (this.direction == 1) this.body.velocity.x = 400;
  else if(this.direction==-1) this.body.velocity.x = -400;
}

magmaShot.prototype.cycleOfLife = function(){
  var currentPosition;
  if (this.direction == 1 || this.direction == -1){
    currentPosition = this.x;
  } else{
    currentPosition = this.y;
  }
  if (Math.abs(currentPosition - this.initialPosition) >= this.maximumDistance)
    this.kill();
}

module.exports = magmaShot;
