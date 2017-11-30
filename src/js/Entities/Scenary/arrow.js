
var entity = require('../entity.js');

function arrow(game, x, y, name, direction){
  entity.call(this, game, x, y, name);
  this.direction = direction;
  this.counter= 0;

}

arrow.prototype.update = function(){
this.move();
this.cycleOfLife(counter);
}

arrow.prototype.move = function(){
  if (this.direction == 1) this.moveRight(150);
  else if(this.direction==-1) this.moveLeft(150);
  else if(this.direction==0) this.moveUp(150);
}

arrow.prototype.cycleOfLife = function(counter){
  counter++;
  if(counter > 200) this.kill();
}

module.exports = arrow;
