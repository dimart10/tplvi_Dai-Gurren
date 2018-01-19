//strengthArrow.js
'use strict'

var item = require('./item.js');
var config = require('../../config.js');

function strengthArrow(game, x, y, name){
  item.call(this, game, x, y, name);
  this.animations.add('strengthArrow', [2], 0, false, 1);
  this.animations.play('strengthArrow');
  this.scale.setTo(config.scale2, config.scale2);
}

strengthArrow.prototype = Object.create(item.prototype); //inherit from item

strengthArrow.prototype.update = function(){

}

//Increases the damage of the arrows
strengthArrow.prototype.effect = function(){
  this.game.bonusDamage++;
  this.game.power_up.play();
}


module.exports = strengthArrow;
