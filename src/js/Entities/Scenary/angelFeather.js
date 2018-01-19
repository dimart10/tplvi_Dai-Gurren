//angelFeather.js
'use strict'

var item = require('./item.js');
var config = require('../../config.js');

function angelFeather(game, x, y, name){
  item.call(this, game, x, y, name);
  this.animations.add('angelFeather', [0], 0, false, 1);
  this.animations.play('angelFeather');
  this.scale.setTo(config.scale2, config.scale2);
}

angelFeather.prototype = Object.create(item.prototype); //inherit from item

angelFeather.prototype.update = function(){

}

angelFeather.prototype.effect = function(){
  this.game.power_up.play();
}


module.exports = angelFeather;
