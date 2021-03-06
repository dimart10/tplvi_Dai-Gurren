//twinbellows.js
'use strict'

var terrestrial = require('./terrestrial.js');
var magmaShot = require('../Scenary/magmaShot.js');
var config = require('../../config.js');
var levelEnd = require('../Scenary/levelEnd.js');

function twinbellows(game, x, y, name, player){
  terrestrial.call(this, game, x, y, name);
  this.player=player;
  this.scale.setTo(config.scale, config.scale);
  this.body.setSize(config.twinbellowsW, config.twinbellowsH, config.twinbellowsOX, config.twinbellowsOH);
  this.maxHealth=config.twinbellowsMaxHealth;
  this.health=this.maxHealth;
  this.attackDamage=config.twinbellowsAttackDamage;
  this.velocity=config.twinbellowsVelocity;
  this.jumpHeight=config.twinbellowsJumpHeight;

  this.animations.add('walkRight', [1, 3], 5, true);
  this.animations.add('walkLeft', [0, 2], 5, true);
  this.animations.play('walkLeft');

  this.direction = -1;
  this.attackTimer=0;
  this.jumpTimer=0;
  this.directionDelay=0;
  this.alert=false;
}

twinbellows.prototype = Object.create(terrestrial.prototype);//inherit from terrestrial

twinbellows.prototype.update = function(){
  if (this.inCamera){
    this.attackTimer++;
    this.jumpTimer++;

    if(this.attackTimer >= config.twinbellowsAttackTime) this.attack();
    if(this.jumpTimer >= config.twinbellowsJumpTime) this.jump();

    this.movement();
    }
  }

  //Receivedamage is redefinded so that it plays the right sound
  //when he receives damage and dies, plus spawning the chest that leads
  //to the ending scene
  twinbellows.prototype.receiveDamage = function(damage){
    this.health-=damage;
    this.game.boss_damage.play();

    if(this.health<=0) {
      var currentLevelEnd = new levelEnd(this.game, this.x, this.y-5, 'chest', 'endScene');
      this.game.groups.items.add(currentLevelEnd);
      currentLevelEnd.scale.setTo(3, 3);
      this.game.victory.play();
      this.game.boss_death.play();
      this.destroy();
    }
  }

//Fires at pit's direction
twinbellows.prototype.attack = function(){
  if(this.x< this.player.x) this.shoot(1);
  else this.shoot(-1);
}

//Shoots a magmaShot
twinbellows.prototype.shoot = function(direction){
  this.game.groups.projectiles.add(new magmaShot(this.game, this.position.x,
    this.position.y, "magmaShot", direction));
  this.attackTimer=0;
}

//Moves towards pit, he has some delay when turning
twinbellows.prototype.movement = function(){
  if(this.x > this.player.x) {
    if(this.direction==1){
      this.directionDelay++;
      if(this.directionDelay >= config.twinbellowsDirectionTimeRight){
        this.direction=-1;
        this.animations.play('walkLeft');
        this.directionDelay=0;
      }
    }
  }
  else if(this.direction==-1) {
    this.directionDelay++;
    if(this.directionDelay>= config.twinbellowsDirectionTimeLeft){
      this.direction=1;
      this.animations.play('walkRight');
      this.directionDelay=0;
    }
  }
  this.horizMove(this.velocity);
}

//It jumps briefly
twinbellows.prototype.jump = function(){
  this.body.velocity.y = this.jumpHeight;
  this.jumpTimer=0;
}

module.exports = twinbellows;
