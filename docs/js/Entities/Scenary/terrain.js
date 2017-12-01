//terrain.js
'use strict'

var entity = require('../entity.js');

function terrain(game, x, y, name){
  entity.call(this, game, x, y, name);
  this.scale.setTo(0.1, 0.1);
  game.physics.p2.enable(this);
  this.body.static = true;
  this.body.data.gravityScale = 0;
}

terrain.prototype = Object.create(entity.prototype);

module.exports = terrain;
