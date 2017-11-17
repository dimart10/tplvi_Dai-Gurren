//pit.js
var entity = require('../entity.js');

function pit(x, y, pitSprite){
  entity.call(this, x, y);
  this.pitSprite = pitSprite;
}

pit.prototype = Object.create(entity.prototype); //Inherits from entity

pit.prototype.newAnimation = function (name, frames, fps, repeat, playOnCreate){
  this.pitSprite.animations.add(name, frames, fps, repeat);
  if (playOnCreate) this.pitSprite.animations.play(name);
}

pit.prototype.update = function(){
  this.pitSprite.x = this.x;
  this.pitSprite.y = this.y;
}

module.exports = pit;
