//barrel.js
'use strict'

var item = require('./item.js');

function barrel(game, x, y, name){
  item.call(this, game, x, y, name);
  this.scale.setTo(2.5,2.5);
}

barrel.prototype = Object.create(item.prototype); //inherit from item

barrel.prototype.update = function(){

}

barrel.prototype.effect = function(){
  this.game.maxBottles=8;
  this.game.get_item.play();
}


module.exports = barrel;
