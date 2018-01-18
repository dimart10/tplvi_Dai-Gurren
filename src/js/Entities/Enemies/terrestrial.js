//terrestrial.js
'use strict';

var enemy = require('./enemy.js');
var config = require('../../config.js');

function terrestrial(game, x, y, name){
  enemy.call(this, game, x, y, name);
  this.body.maxVelocity.y = config.maxVelocity;
}

terrestrial.prototype = Object.create(enemy.prototype);//inherit from enemy

//Moves toroidally either right or left depeneding on the direction given at
//given the velocity
terrestrial.prototype.horizMove = function(velocity){
  if(this.direction==-1){
    this.body.velocity.x=- velocity;
  }
  else if(this.direction==1){
    this.body.velocity.x= velocity;
  }
  this.game.world.wrap(this, 0, false, true, false);
}

module.exports = terrestrial;
