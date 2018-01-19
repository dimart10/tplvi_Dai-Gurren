//nettler.js
'use strict'

var terrestrial = require('./terrestrial.js');
var config = require('../../config.js');

function nettler(game, x, y, name, direction, player){
  terrestrial.call(this, game, x, y, name);
  this.player=player;
  this.direction = direction;
  this.scale.setTo(config.scale2, config.scale2);
  this.body.setSize(config.nettlerW, config.nettlerH, config.nettlerOX, config.nettlerOY);
  this.maxHealth=config.nettlerMaxHealth;
  this.health = this.maxHealth;
  this.velocity=config.nettlerVelocity;
  this.attackDamage=config.nettlerAttackDamage;
  this.heartValue=config.nettlerHeartValue;

  this.animations.add('walkLeft', [36,37], 5, true);
  this.animations.add('walkRight', [40,41], 5, true);
  this.animations.add('crouchLeft', [38], 0, false);
  this.animations.add('crouchRight', [39], 0, false);

  if(this.direction==1) this.animations.play('walkRight');
  else if(this.direction==-1) this.animations.play('walkLeft');

  this.alert=false;
  this.crouching=false;
  this.crouchTimer=0;
}

nettler.prototype = Object.create(terrestrial.prototype);//inherit from terrestrial

nettler.prototype.update = function(){
  if (this.inCamera){
    if(!this.alert) {
      this.regularMovement();
      this.detectPit();
    }
    else{
      if(!this.crouching && this.player.arrowTimer<=8) {
        this.crouching=true;
        this.crouch();
      }
      if(this.crouching){
        this.crouchTimer++;
        if(this.crouchTimer>=config.nettlerCrouchTime) {
          this.crouching = false;
          this.crouchTimer=0;
          this.body.setSize(config.nettlerW, config.nettlerH, config.nettlerOX, config.nettlerOY);
        }
      }
      this.alertMovement();
    }
  }
}

//Walks towards pit
nettler.prototype.alertMovement = function(){
  if(this.x > this.player.x) {
      this.direction=-1;
      if(!this.crouching) this.animations.play('walkLeft');
  }
  else {
      this.direction=1;
      if(!this.crouching) this.animations.play('walkRight');
    }
  this.horizMove(this.velocity);
}

//Walks in the current direction, if it runs into a wall, the direction is inverted
nettler.prototype.regularMovement = function(){
  if(this.body.onWall()) {
    this.direction = this.direction*(-1);
    if(this.direction==1) this.animations.play('walkRight');
    else if(this.direction==-1) this.animations.play('walkLeft');
  }
  this.horizMove(this.velocity);
}

//When an arrow is fired, this crouches
nettler.prototype.crouch = function(){
  if(this.direction==1) this.animations.play('crouchRight');
  else this.animations.play('crouchLeft');

  this.body.setSize(config.nettlerCrouchW, config.nettlerCrouchH, config.nettlerCrouchOX, config.nettlerCrouchOY);
  this.body.position.y+=4;
}

//Looks for pit in its y position and its direction
nettler.prototype.detectPit = function(){
    if (Math.abs(this.y - this.player.y) < config.nettlerRangeDetection){
      if (this.player.x > this.x) {
        if(this.direction==1) this.alert=true;

      else if(this.direction==-1) this.alert=true;
    }
  }
}


module.exports = nettler;
