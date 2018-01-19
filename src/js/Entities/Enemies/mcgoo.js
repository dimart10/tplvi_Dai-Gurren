//mcgoo.js
'use strict'

var terrestrial = require('./terrestrial.js');
var magmaShot = require('../Scenary/magmaShot.js');
var config = require('../../config.js');

function mcgoo(game, x, y, name, player){
  terrestrial.call(this, game, x, y, name);
  this.player=player;
  this.scale.setTo(config.scale2, config.scale2);
  this.body.setSize(config.mcgooW, config.mcgooH, config.mcgooOX, config.mcgooOY);
  this.maxHealth=config.mcgooMaxHealth;
  this.health=this.maxHealth;
  this.heartValue=config.mcgooHeartValue;
  this.attackDamage=config.mcgooAttackDamage;

  this.animations.add('attack', [84,87], 5, true);
  this.animations.add('crouch', [85,86], 5, true);
  this.animations.play('crouch');

  this.alert=false;
  this.attackTimer=0;
  this.aimTimer=0;
}

mcgoo.prototype = Object.create(terrestrial.prototype);//inherit from terrestrial

mcgoo.prototype.update = function(){
  if (this.inCamera){
    if(!this.alert) this.detectPit();
    else{
      this.attackTimer++;

      if(this.attackTimer>=config.mcgooTimeBeetweenAttacks){
        this.animations.play('attack');
        this.body.setSize(config.mcgooW, config.mcgooH, config.mcgooOX, config.mcgooOY);
        this.aimTimer++;
        if(this.aimTimer>=config.mcgooAimTime) this.attack();
      }
    }
  }
}

//Looks for pit in the y ais
mcgoo.prototype.detectPit = function(){
  if (Math.abs(this.y - this.player.y) < config.mcgooDetectionRange){
    this.alert = true;
    this.animations.play('crouch');
    this.body.setSize(config.mcgooHiddenW, config.mcgooHiddenH, config.mcgooHiddenOX, config.mcgooHiddenOY);
  }
}

//Fires a magmashot at pit and changes the animation
mcgoo.prototype.attack = function(){
  if(this.x< this.player.x) this.shoot(1);
  else this.shoot(-1);
  this.animations.play('crouch');
  this.body.setSize(config.mcgooHiddenW, config.mcgooHiddenH, config.mcgooHiddenOX, config.mcgooHiddenOY);
  this.body.position.y+=config.mcgooHiddenOY;
}

//Fires a magma shot in the given direction
mcgoo.prototype.shoot = function(direction){
  this.game.groups.projectiles.add(new magmaShot(this.game, this.position.x,
    this.position.y, "magmaShot", direction));

  this.attackTimer=0;
  this.aimTimer=0;

}

module.exports = mcgoo;
