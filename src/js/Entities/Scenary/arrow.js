
var entity = require('../entity.js');

function arrow(game, x, y, name, direction){
  this.direction = direction;
  if(this.direction==1)  entity.call(this, game, x +25, y, name);
  else if (this.direction==-1)  entity.call(this, game, x -25, y, name);
  else if (this.direction==0)  entity.call(this, game, x, y - 50, name);
  this.counter= 0;
  game.physics.p2.enable(this);
  this.body.data.gravityScale = 0;


//if(direction==0) this.body.rotation=90;
//else if(direction==-1) this.body.rotation=180;

}

arrow.prototype = Object.create(entity.prototype);

arrow.prototype.update = function(){
this.move();
this.cycleOfLife(this.counter);
}

arrow.prototype.move = function(){
  if (this.direction == 1) this.body.moveRight(100);
  else if(this.direction==-1) this.body.moveLeft(100);
  else if(this.direction==0) this.body.moveUp(100);
}

arrow.prototype.cycleOfLife = function(counter){
  this.counter++;
  if(this.counter > 200) this.kill();
}

module.exports = arrow;
