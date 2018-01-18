//entity.js
'use strict'

var main = require("../main.js");
var Phaser = main.Phaser;

function entity(game, x, y, name){
  Phaser.Sprite.call(this, game, x, y, name);
  game.add.existing(this);
  this.anchor.setTo(0.5, 0.5);
}

entity.prototype = Object.create(Phaser.Sprite.prototype);
entity.prototype.constructor = entity;
entity.prototype.update = function() {}

module.exports = entity;
