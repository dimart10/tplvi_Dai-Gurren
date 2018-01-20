//movingPlatform.js
'use strict';

var entity = require('../entity.js');
var config = require('../../config.js');

function movingPlatform(game, x, y, name){
  entity.call(this, game, x, y, name);
  this.game.physics.arcade.enable(this);
  this.scale.setTo(config.scale2, config.scale2);
  this.body.allowGravity = false;
  this.direction=-1;
  this.velocity=config.movingPlatformVelocity;
  this.body.checkCollision.down = false;
  this.body.checkCollision.left = false;
  this.body.checkCollision.right = false;

  this.body.immovable=true;
}

movingPlatform.prototype = Object.create(entity.prototype);//inherit from entity

movingPlatform.prototype.update = function(){
  this.movement();
}

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
