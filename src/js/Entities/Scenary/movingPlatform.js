//movingPlatform.js
'use strict';

var entity = require('../entity.js');
var config = require('../../config.js');

function movingPlatform(game, x, y, name){
  entity.call(this, game, x, y, name);
  this.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = false;
  this.scale.setTo(config.scale2, config.scale2);
  this.body.allowGravity = false;
  this.direction=-1;

}

movingPlatform.prototype = Object.create(entity.prototype);//inherit from entity

movingPlatform.prototype.movement = function(){
  if(this.body.onWall()) {
    this.direction = this.direction*(-1);
  }

  if(this.direction==-1){
    this.body.velocity.x=- this.velocity;
  }
  else if(this.direction==1){
    this.body.velocity.x= this.velocity;
  }
  this.game.world.wrap(this, 0, false, true, false);
}



module.exports = movingPlatform;
