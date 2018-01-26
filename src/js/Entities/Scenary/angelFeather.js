//angelFeather.js
'use strict'

var item = require('./item.js');
var config = require('../../config.js');
var HUD = require('../../HUD/hud.js');

function angelFeather(game, x, y, name){
  item.call(this, game, x, y, name);
  this.animations.add('angelFeather', [0], 0, false, 1);
  this.animations.play('angelFeather');
  this.scale.setTo(config.scale2, config.scale2);
}

angelFeather.prototype = Object.create(item.prototype); //inherit from item

angelFeather.prototype.update = function(){

}

//Increases pits health and maxehealth 
angelFeather.prototype.effect = function(){
  this.game.pit.health += config.angelFeatherHealth;
  this.game.pit.maxHealth += config.angelFeatherHealth;

  HUD.createHealthBar();
  this.game.power_up.play();
}


module.exports = angelFeather;
