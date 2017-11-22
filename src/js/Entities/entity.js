//entity.js

function entity(name, x, y, game){
  Phaser.Sprite.call(this, game, x, y, name);
  this.anchor.setTo(0, 0);
}

entity.prototype = Object.create(Phaser.Sprite.prototype);
entity.prototype.update = function() {}

module.exports = entity;
