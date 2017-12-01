
var entity = require('../entity.js');

function arrow(game, x, y, name, direction){
  this.direction = direction;
  if(this.direction==1)  entity.call(this, game, x +25, y, name);
  else if (this.direction==-1)  entity.call(this, game, x -25, y, name);
  else if (this.direction==0)  entity.call(this, game, x, y - 50, name);
  else if(this.direction==2) entity.call(this, game, x, y+20, name);
  this.counter= 0;
  game.physics.p2.enable(this);
  this.body.data.gravityScale = 0;
  if(direction==0) this.body.angle=-90;
  else if(direction==-1) this.body.angle=180;
//  this.body.fixedRotation=true;



}

arrow.prototype = Object.create(entity.prototype);

arrow.prototype.update = function(){
this.move();
this.cycleOfLife();
}

arrow.prototype.move = function(){
  if (this.direction == 1) this.body.moveRight(250);
  else if(this.direction==-1) this.body.moveLeft(250);
  else if(this.direction==0) this.body.moveUp(250);
  else if (this.direction==2) this.body.moveDown(250);
}

arrow.prototype.cycleOfLife = function(){
  this.counter++;
  if(this.counter > 75) this.kill();
}

module.exports = arrow;
