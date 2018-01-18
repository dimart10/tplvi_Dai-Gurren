//bottle.js
'use strict'

var item = require('./item.js');

function bottle(game, x, y, name, player){
  item.call(this, game, x, y, name);
  this.animations.add('bottle', [0], 0, false, 1);
  this.scale.setTo(2.5,2.5);
  this.player = player;
}

bottle.prototype = Object.create(item.prototype); //inherit from item

bottle.prototype.update = function(){

}

bottle.prototype.effect = function(){
  this.game.bottles++;
  if(this.game.bottles>this.game.maxBottles) {
    this.game.bottles=this.game.maxBottles;
  }
  this.game.get_item.play();
}


module.exports = bottle;
