//arrow.js
'use strict'

var entity = require('../entity.js');

function arrow(game, x, y, name, direction){
  this.direction = direction;
  if(this.direction==1)  entity.call(this, game, x+60, y+20, name);
  else if (this.direction==-1)  entity.call(this, game, x+20, y+20, name);
  else if (this.direction==0)  entity.call(this, game, x+ 35, y+10, name);
  else if(this.direction==2) entity.call(this, game, x, y, name);

  this.counter= 0;

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
  if (this.direction == 1) this.body.velocity.x = 250;
  else if(this.direction==-1) this.body.velocity.x = -250;
  else if(this.direction==0) this.body.velocity.y = -250;
  else if (this.direction==2) this.body.velocity.y = 250;
}

arrow.prototype.cycleOfLife = function(){
  this.counter++; //DELTA TIMEEEEEEEEEEEEEEEEEEEEEEEEEEEE
  if(this.counter > 75) this.kill();
}

module.exports = arrow;
