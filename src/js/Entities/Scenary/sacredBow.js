//sacredBow.js
'use strict'

var item = require('./item.js');
var config = require('../../config.js');

function sacredBow(game, x, y, name){
  item.call(this, game, x, y, name);
  this.animations.add('sacredBow', [1], 0, false, 1);
  this.animations.play('sacredBow');
  this.scale.setTo(config.scale2, config.scale2);
}

sacredBow.prototype = Object.create(item.prototype); //inherit from item

sacredBow.prototype.update = function(){

}

//Sets hasSacredBow as true
sacredBow.prototype.effect = function(){
  this.game.hasSacredBow=true;
  this.game.power_up.play();
}


module.exports = sacredBow;
