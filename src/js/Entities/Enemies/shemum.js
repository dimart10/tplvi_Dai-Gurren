//shemum.js
'use strict'

var terrestrial = require('./terrestrial.js');
var config = require('../../config.js');

function shemum(game, x, y, name, direction){
  terrestrial.call(this, game, x, y, name);

  this.direction=direction;
  this.velocity = config.shemumVelocity;
  this.scale.setTo(config.scale2, config.scale2);
  this.body.setSize(config.shemumW, config.shemumH, config.shemumOX, config.shemumOY);
  this.maxHealth=config.shemumMaxHealth;
  this.health=this.maxHealth;
  this.attackDamage=config.shemumAttackDamage;
  this.heartValue=config.shemumHeartValue;

  this.animations.add('walkRight', [2, 3], 5, true);
  this.animations.add('walkLeft', [0, 1], 5, true);

  if(this.direction==1) this.animations.play('walkRight');
  else if(this.direction==-1) this.animations.play('walkLeft');
}

shemum.prototype = Object.create(terrestrial.prototype);//inherit from terrestrial

shemum.prototype.update = function(){
  if (this.inCamera){
      this.movement();
  }
}

//Walks in the current direction, if it runs into a wall, the direction is inverted
shemum.prototype.movement = function(){
  if(this.body.onWall()) {
    this.direction = this.direction*(-1);
    if(this.direction==1) this.animations.play('walkRight');
    else if(this.direction==-1) this.animations.play('walkLeft');
  }
  this.horizMove(this.velocity);
}
module.exports = shemum;
