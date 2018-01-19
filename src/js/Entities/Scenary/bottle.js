//bottle.js
'use strict'

var item = require('./item.js');
var config = require('../../config.js');

function bottle(game, x, y, name, player){
  item.call(this, game, x, y, name);
  this.animations.add('bottle', [0], 0, false, 1);
  this.scale.setTo(config.scale2, config.scale2);
  this.player = player;
}

bottle.prototype = Object.create(item.prototype); //inherit from item

bottle.prototype.update = function(){

}

//increases the number of bottles you are carrying (below maximum)
bottle.prototype.effect = function(){
  this.game.bottles++;
  if(this.game.bottles>this.game.maxBottles) {
    this.game.bottles=this.game.maxBottles;
  }

  this.game.get_item.play();
}


module.exports = bottle;
