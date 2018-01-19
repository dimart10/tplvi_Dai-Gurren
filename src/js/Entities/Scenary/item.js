//item.js
'use strict'

var entity = require('../entity.js');
var config = require('../../config.js');

function item(game, x, y, name){
  entity.call(this, game, x, y, name);
  game.physics.arcade.enable(this);
  this.body.allowGravity = false;
}

item.prototype = Object.create(entity.prototype);

item.prototype.update = function(){
}

item.prototype.onPickUp = function(){
  this.effect();
  this.destroy();

}

item.prototype.effect = function(){
}


module.exports = item;
