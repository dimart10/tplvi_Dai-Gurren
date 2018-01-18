//monoeye.js
'use strict'

var flying = require('./flying.js');
var config = require('../../config.js');

function monoeye(game, x, y, name, player){
  flying.call(this, game, x, y, name);

  this.player=player;
  this.goalX=this.player.x;
  this.goalY=this.player.y;
  this.velocity=config.monoeyeVelocity;
  this.radius=config.monoeyeRadius;
  this.scale.setTo(config.scale2, config.scale2);
  this.body.setSize(config.monoeyeW, config.monoeyeH, config.monoeyeOX, config.monoeyeOY);
  this.maxHealth=config.monoeyeMaxHealth;
  this.health=this.maxHealth;
  this.heartValue=config.monoeyeHeartValue;
  this.attackDamage=config.monoeyeAttackDamage;


  this.animations.add('right', [21], 0, false);
  this.animations.add('left', [20], 0, false);

  if(this.x>this.player.x) this.animations.play('left');
  else if(this.x<this.player.x) this.animations.play('right');
}

monoeye.prototype = Object.create(flying.prototype);

monoeye.prototype.update = function(){
  if (this.inCamera){
    this.swoop();
    if(this.x>this.player.x) this.animations.play('left');
    else if(this.x<this.player.x) this.animations.play('right');
    }
  }

module.exports = monoeye;
