//reapette.js
'use strict'

var flying = require('./flying.js');
var config = require('../../config.js');

function reapette(game, x, y, name, player){
  flying.call(this, game, x, y, name);

  this.player=player;
  this.goalX=this.player.x;
  this.goalY=this.player.y;
  this.velocity=config.reapetteVelocity;
  this.radius=config.reapetteRadius;
  this.scale.setTo(config.scale2, config.scale2);
  this.body.setSize(config.reapetteW, config.reapetteH, config.reapetteOX, config.reapetteOY);
  this.maxHealth=config.reapetteMaxHealth;
  this.health=this.maxHealth;
  this.attackDamage=config.reapetteAttackDamage;
  this.heartValue=config.reapetteHeartValue;

  this.animations.add('right', [75], 0, false);
  this.animations.add('left', [74], 0, false);

  if(this.x>this.player.x) this.animations.play('left');
  else if(this.x<this.player.x) this.animations.play('right');
}

reapette.prototype = Object.create(flying.prototype);

reapette.prototype.update = function(){
  if (this.inCamera){
    if(!this.alert){
      this.swoop();
      if(this.x>this.player.x) this.animations.play('left');
      else if(this.x<this.player.x) this.animations.play('right');
    }
  }
}

module.exports = reapette;
