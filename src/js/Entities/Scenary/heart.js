//heart.js
'use strict'

var item = require('./item.js');
var config = require('../../config.js');

function heart(game, x, y, name, value){
  item.call(this, game, x, y, name);
  this.value = value;
  this.scale.setTo(config.scale2, config.scale2);

  this.animations.add('small', [0], 0, false);
  this.animations.add('medium', [1], 0, false);
  this.animations.add('big', [2], 0, false);

  if(this.value==1)this.animations.play('small');
  else if (this.value==5)this.animations.play('medium');
  else if (this.value==10)this.animations.play('big');

  this.timer=0;
}

heart.prototype = Object.create(item.prototype); //inherit from item

heart.prototype.update = function(){
this.cycleOfLife();
}

//increases the amount of heart by its value
heart.prototype.effect = function(){
  this.game.hearts+=this.value;
  this.game.get_item.play();
  this.game.heartText.setText(this.game.hearts);
}

//it dissapears after a given time
heart.prototype.cycleOfLife = function(){
  this.timer++;
  if(this.timer >= config.heartTime) this.destroy();
}

module.exports = heart;
