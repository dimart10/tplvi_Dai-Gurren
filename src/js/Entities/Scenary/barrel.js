//barrel.js
'use strict'

var item = require('./item.js');
var config = require('../../config.js');

function barrel(game, x, y, name){
  item.call(this, game, x, y, name);
  this.scale.setTo(config.scale2, config.scale2);
}

barrel.prototype = Object.create(item.prototype); //inherit from item

barrel.prototype.update = function(){

}

barrel.prototype.effect = function(){
  this.game.maxBottles=config.maxBottles;
  this.game.power_up.play();
}


module.exports = barrel;
