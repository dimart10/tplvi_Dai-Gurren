//reaper.js
'use strict'

var terrestrial = require('./terrestrial.js');
var reapette = require('./reapette.js');
var heart = require('../Scenary/heart.js');
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



  this.turn=false;
  this.turnTimer=0;
  this.alertTimer=0;
  this.alert=false;
  this.direction=direction;

  if(this.direction==1) this.animations.play('patrolRight');
  else if(this.direction==-1) this.animations.play('patrolLeft');

  this.edgeLayer = edgeLayer;
}

reaper.prototype = Object.create(terrestrial.prototype);//inherit from terrestrial

//if reaper is killed, the music stops
reaper.prototype.receiveDamage = function(damage){
  if (this.health <= 0){
    this.game.reaper_spotted.stop();
    this.game.underworld.loopFull();
  }

  terrestrial.prototype.receiveDamage.call(this, damage);
}

reaper.prototype.update = function(){
  if(this.alert){
    this.alertTimer++;
    if(this.alertTimer > config.reaperTimeToTurn) this.exitAlert();
  }
  if (this.inCamera){
    if(!this.alert) this.detectPit();
    this.game.physics.arcade.collide(this, this.edgeLayer);
      this.movement();
  }
}


//looks for pit in the y axis and its direction
reaper.prototype.detectPit = function(){
  if (Math.abs(this.y - this.player.y) < config.reaperDetectionRange) {
        if (this.player.x > this.x) {
          if(this.direction==1) this.onAlert();
        }
        else if(this.direction==-1) this.onAlert();
    }
}

//Redefines enemy.receiveDamage(reaper must stop the music)
reaper.prototype.receiveDamage = function(damage){
  this.health-=damage;
  this.game.enemy_damage.play();

  if(this.health<=0) {
    this.game.reaper_spotted.stop();
    this.game.underworld.loopFull();
    this.game.enemy_death.play();
    if(this.heartValue!=0){
      this.game.groups.items.add(new heart(this.game, this.position.x, this.position.y, 'heart', this.heartValue));
    }
    this.destroy();
  }
}


//Moves until it runs into a wall or edge, then in switches direction
reaper.prototype.movement = function(){
if(!this.alert){
  if(this.body.onWall()) {
    this.direction = this.direction * (-1);
    if(this.direction==1) this.animations.play('patrolRight');
    else if(this.direction==-1) this.animations.play('patrolLeft');
  }
}

if(!this.turn) {
   this.horizMove(this.velocity);
   if(this.turnTimer > config.reaperTimeToTurn) this.onTurn();
}
if(this.turn && this.turnTimer > config.reaperTurnTime) this.exitTurn();
  this.turnTimer++;
}

//When alerted it spawns two reaettes, changes its movement and animation
//and switches the music and
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

//When the alert ends its behaviour and the music return to normal
reaper.prototype.exitAlert = function(){
  this.game.reaper_spotted.stop();
  this.game.underworld.loopFull();
  this.alert=false;
  this.alertTimer=0;
  this.velocity/=config.reaperVelocityMultiplier;

  if(this.direction==1) this.animations.play('patrolRight');
  else if(this.direction==-1)this.animations.play('patrolLeft');
}

//On turn it turns and waits a few moments
reaper.prototype.onTurn = function(){
  this.turn=true;
  this.body.velocity.x=0;
  this.turnTimer=0;
  if(this.direction==1)
  {this.direction=-1; this.animations.play('patrolLeft');}
  else if(this.direction==-1)
  {this.direction=1; this.animations.play('patrolRight');}
}

//After turning he returns to patrolling
reaper.prototype.exitTurn = function(){
  this.turn=false;
  this.turnTimer=0;
  if(this.direction==1)
  {this.direction=-1; this.animations.play('patrolLeft');}
  else if(this.direction==-1)
  {this.direction=1; this.animations.play('patrolRight');}
}

module.exports = reaper;
