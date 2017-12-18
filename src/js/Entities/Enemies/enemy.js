//enemy.js
'use strict';

var entity = require('../entity.js');

function enemy(game, x, y, name){
  entity.call(this, game, x, y, name);
  this.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = false;
  this.maxHealth;
  this.attackDamage;
  this.alive=true;
  this.health;

}

enemy.prototype = Object.create(entity.prototype);//inherit from entity

enemy.prototype.receiveDamage =function(arrow){
  this.health-=arrow.damage;
  if(this.health<=0) this.destroy();
}

module.exports = enemy;
