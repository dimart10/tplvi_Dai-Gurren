//terrestrial.js
'use strict';

var entity = require('../entity.js');

function terrestrial(game, x, y, name){
  entity.call(this, game, x, y, name);
  this.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = false;
}

terrestrial.prototype = Object.create(entity.prototype);//inherit from entity

//Moves toroidally either right or left depeneding on the direction given at
//given the velocity
terrestrial.prototype.horizMove = function(velocity, direction){
  if(this.direction==-1){
    this.body.velocity.x=- velocity;
  }
  else if(this.direction==1){
    this.body.velocity.x= velocity;
  }
  this.game.world.wrap(this, 0, false, true, false);
}

module.exports = terrestrial;
