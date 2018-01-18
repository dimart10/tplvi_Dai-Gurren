//reaper.js
'use strict'

var terrestrial = require('./terrestrial.js');
var reapette = require('./reapette.js');
var config = require('../../config.js');

function reaper(game, x, y, name, direction, player, edgeLayer){
  terrestrial.call(this, game, x, y, name);
  this.player=player;

  this.velocity = config.reaperVelocity;
  this.scale.setTo(config.scale2, config.scale2);
  this.body.setSize(config.reaperW, config.reaperH, config.reaperOX, config.reaperOY);
  this.maxHealth=config.reaperMaxHealth;
  this.health=this.maxHealth;
  this.attackDamage=config.reaperAttackDamage;
  this.heartValue=config.reaperHeartValue;

  this.animations.add('patrolRight', [25], 0, false);
  this.animations.add('alertRight', [26,27], 5, true);
  this.animations.add('patrolLeft', [24], 0, false);
  this.animations.add('alertLeft', [22,23], 5, true);

  if(this.direction==1) this.animations.play('patrolRight');
  else if(this.direction==-1) this.animations.play('patrolLeft');

  this.turn=false;
  this.turnTimer=0;
  this.alertTimer=0;
  this.alert=false;
  this.direction=direction;

  this.edgeLayer = edgeLayer;
}

reaper.prototype = Object.create(terrestrial.prototype);//inherit from terrestrial

reaper.prototype.receiveDamage = function(damage){
  if (this.health <= 0){
    this.game.reaper_spotted.stop();
    this.game.underworld.loopFull();
  }

  terrestrial.prototype.receiveDamage.call(this, damage);
}

reaper.prototype.update = function(){
  if (this.inCamera){
    if(!this.alert) this.detectPit();
    this.game.physics.arcade.collide(this, this.edgeLayer);
      this.movement();
  }
}



reaper.prototype.detectPit = function(){
  if (Math.abs(this.y - this.player.y) < config.reaperDetectionRange) {
        if (this.player.x > this.x) {
          if(this.direction==1) this.onAlert();
        }
        else if(this.direction==-1) this.onAlert();
    }
}

reaper.prototype.movement = function(){
if(!this.alert){
  if(this.body.onWall()) {
    this.direction = this.direction * (-1);
    if(this.direction==1) this.animations.play('patrolRight');
    else if(this.direction==-1) this.animations.play('patrolLeft');
  }
}
else{
  this.alertTimer++;
  if(this.alertTimer > config.reaperTimeToTurn) this.exitAlert();
}
if(!this.turn) {
   this.horizMove(this.velocity);
   if(this.turnTimer > config.reaperTimeToTurn) this.onTurn();
}
if(this.turn && this.turnTimer > config.reaperTurnTime) this.exitTurn();
  this.turnTimer++;
}

reaper.prototype.onAlert = function(){
    this.game.reaper_spotted.loopFull();
    this.game.underworld.stop();
    this.alert=true;
    this.turn=false;
    this.turnTimer=0;
    if(this.direction==1) this.animations.play('alertRight');
    else if(this.direction==-1) this.animations.play('alertLeft');
    this.velocity*=config.reaperVelocityMultiplier
    ;
    this.game.groups.enemies.add(new reapette(this.game, this.x, this.y -200, 'enemies', this.player));
    this.game.groups.enemies.add(new reapette(this.game, this.x+100, this.y -230, 'enemies', this.player));
  }

reaper.prototype.exitAlert = function(){
  this.game.reaper_spotted.stop();
  this.game.underworld.loopFull();
  this.alert=false;
  this.alertTimer=0;
  this.velocity/=config.reaperVelocityMultiplier;

  if(this.direction==1) this.animations.play('patrolRight');
  else if(this.direction==-1)this.animations.play('patrolLeft');
}

reaper.prototype.onTurn = function(){
  this.turn=true;
  this.body.velocity.x=0;
  this.turnTimer=0;
  if(this.direction==1)
  {this.direction=-1; this.animations.play('patrolLeft');}
  else if(this.direction==-1)
  {this.direction=1; this.animations.play('patrolRight');}
}

reaper.prototype.exitTurn = function(){
  this.turn=false;
  this.turnTimer=0;
  if(this.direction==1)
  {this.direction=-1; this.animations.play('patrolLeft');}
  else if(this.direction==-1)
  {this.direction=1; this.animations.play('patrolRight');}
}

module.exports = reaper;
