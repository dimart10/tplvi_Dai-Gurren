//flying.js
'use strict';

var entity = require('../entity.js');

function flying(game, x, y, name, player){
  entity.call(this, game, x, y, name);
  this.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = false;
  this.body.allowGravity= false;
  this.goalX;
  this.goalY;
  this.velocity;
  this.radius;
  this.rotateangle =0;
}

flying.prototype = Object.create(entity.prototype);//inherit from entity

//goal does a W trajectory around the player, this chases the goal
flying.prototype.swoop = function(){
  var fixRatio= this.radius;
  if(Math.round(Math.cos((this.rotateangle)))==-1) fixRatio*=-1;
  this.goalX = this.radius * Math.cos((this.rotateangle/1.5)) + this.player.x + fixRatio;
  this.goalY = -this.radius * Math.cos((this.rotateangle)) + this.player.y;
  if(this.x< this.goalX) this.x+=this.velocity;
  else if(this.x> this.goalX) this.x-=this.velocity;
  if(this.y< this.goalY) this.y+=this.velocity;
  else if(this.y> this.goalY) this.y -= this.velocity;

  this.rotateangle+=.02;


}


module.exports = flying;
