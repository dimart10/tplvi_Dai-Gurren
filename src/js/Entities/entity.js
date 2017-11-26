//entity.js
var main = require("../main.js");
var Phaser = main.Phaser;

function entity(name, x, y, game){
  Phaser.Sprite.call(this, game, x, y, name);
  game.add.existing(this);
  this.anchor.setTo(0, 0);
}

entity.prototype = Object.create(Phaser.Sprite.prototype);
entity.prototype.constructor = entity;
entity.prototype.update = function() {}

module.exports = entity;
