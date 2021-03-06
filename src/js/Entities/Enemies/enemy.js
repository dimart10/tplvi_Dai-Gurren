//enemy.js
'use strict';

var entity = require('../entity.js');
var heart = require('../Scenary/heart.js');
var config = require('../../config.js');

function enemy(game, x, y, name){
  entity.call(this, game, x, y, name);
  this.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = false;
  this.maxHealth;
  this.attackDamage;
  this.alive=true;
  this.health;
  this.heartValue=0;

}

enemy.prototype = Object.create(entity.prototype);//inherit from entity

//Method that deals the given damage and destroys this if health<=0
enemy.prototype.receiveDamage =function(damage){
  this.health-=damage;
  this.game.enemy_damage.play();

  if(this.health<=0) {
    this.game.enemy_death.play();
    if(this.heartValue!=0){
      this.game.groups.items.add(new heart(this.game, this.position.x, this.position.y, 'heart', this.heartValue));
    }
    this.destroy();
  }
}

module.exports = enemy;
