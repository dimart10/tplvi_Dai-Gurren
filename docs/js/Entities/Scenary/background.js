//background.js
'use strict'

var entity = require('../entity.js');

function background(game, x, y, name){
  entity.call(this, game, x, y, name);
  this.scale.setTo(3.12, 3.12);
}

background.prototype = Object.create(entity.prototype);

module.exports = background;
