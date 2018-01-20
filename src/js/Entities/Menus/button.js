//entity.js
'use strict'

var entity = require('../entity.js');

function button(game, x, y, name, onClickCallback){
  Phaser.Sprite.call(this, game, x, y, name);
  game.add.existing(this);
  this.anchor.setTo(0.5, 0.5);

  this.selected = false;
  this.onClickCallback = onClickCallback;
}

button.prototype = Object.create(entity.prototype);

button.prototype.update = function(){
  if (this.selected) this.alpha = 1;
  else this.alpha = 0.7;
}

module.exports = button;
