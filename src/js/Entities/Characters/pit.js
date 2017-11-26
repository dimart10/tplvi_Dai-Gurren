//pit.js
var entity = require('../entity.js');

function pit(name, x, y, game){
  entity.call(this, name, x, y, game);
  this.newAnimation('walk', [21, 22, 23, 24], 5, true, true);
}

pit.prototype = Object.create(entity.prototype); //Inherits from entity

pit.prototype.newAnimation = function (name, frames, fps, repeat, playOnCreate){
  this.animations.add(name, frames, fps, repeat);
  if (playOnCreate) this.animations.play(name);
}

pit.prototype.update = function(){
  
}

module.exports = pit;
