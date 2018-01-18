//chalice.js
'use strict'

var item = require('./item.js');

function chalice(game, x, y, name, player){
  item.call(this, game, x, y, name);
  this.animations.add('chalice', [1], 0, false);
  this.animations.play('chalice');
  this.scale.setTo(2.5,2.5);
  this.player = player;
}

chalice.prototype = Object.create(item.prototype); //inherit from item

chalice.prototype.update = function(){

}

chalice.prototype.effect = function(){
  this.player.health+=7;
  if(this.player.health > this.player.maxHealth) {
    this.player.health = this.player.maxHealth;
  }
  this.player.updateHealthBar();
  this.game.get_item.play();
}


module.exports = chalice;
