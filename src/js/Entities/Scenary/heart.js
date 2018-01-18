//heart.js
'use strict'

var item = require('./item.js');

function heart(game, x, y, name, value){
  item.call(this, game, x, y, name);
  this.value = value;
  this.timer=0;
  this.scale.setTo(2.5,2.5);
  this.animations.add('small', [0], 0, false);
  this.animations.add('medium', [1], 0, false);
  this.animations.add('big', [2], 0, false);
  if(this.value==1)this.animations.play('small');
  else if (this.value==5)this.animations.play('medium');
  else if (this.value==10)this.animations.play('big');
}

heart.prototype = Object.create(item.prototype); //inherit from item

heart.prototype.update = function(){
this.cycleOfLife();
}

heart.prototype.effect = function(){
  this.game.hearts+=this.value;
  this.game.get_item.play();
}

heart.prototype.cycleOfLife = function(){
  this.timer++;
  if(this.timer>=300) this.destroy();

}

module.exports = heart;
