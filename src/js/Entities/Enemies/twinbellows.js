//twinbellows.js
'use strict'

var terrestrial = require('./terrestrial.js');
var magmaShot = require('../Scenary/magmaShot.js')

function twinbellows(game, x, y, name, player, groups){
  terrestrial.call(this, game, x, y, name);
  this.groups=groups;
  this.player=player;
  this.scale.setTo(3.0, 3.0);
  this.body.setSize(30, 24, 0,0);
  this.maxHealth=100;
  this.health=100;
  this.attackDamage=2;
  this.attackTimer=0;
  this.jumpTimer=0;
  this.directionDelay=0;
  this.alert=false;
  this.velocity=70;
  this.direction = -1;
  this.animations.add('walkRight', [1, 3], 5, true);
  this.animations.add('walkLeft', [0, 2], 5, true);
  this.animations.play('walkLeft');

}

twinbellows.prototype = Object.create(terrestrial.prototype);//inherit from terrestrial

twinbellows.prototype.update = function(){
  if (this.inCamera){
    this.attackTimer++;
    this.jumpTimer++;
    if(this.attackTimer>=100) this.attack();
    if(this.jumpTimer>=220) this.jump();
    this.movement();
    }
  }

twinbellows.prototype.attack = function(){
  if(this.x< this.player.x) this.shoot(1);
  else this.shoot(-1);
}

twinbellows.prototype.shoot = function(direction){
  this.groups.projectiles.add(new magmaShot(this.game, this.position.x,
    this.position.y, "magmaShot", direction));
  this.attackTimer=0;
}

twinbellows.prototype.movement = function(){
  if(this.x > this.player.x) {
    if(this.direction==1){
      this.directionDelay++;
      if(this.directionDelay>=150){
        this.direction=-1;
        this.animations.play('walkLeft');
        this.directionDelay=0;
      }
    }
  }
  else if(this.direction==-1) {
    this.directionDelay++;
    if(this.directionDelay>=40){
      this.direction=1;
      this.animations.play('walkRight');
      this.directionDelay=0;
    }
  }
  this.horizMove(this.velocity);
}

twinbellows.prototype.jump = function(){
  this.body.velocity.y = -800;
  if(this.jumpTimer>=225) this.jumpTimer=0;
}

module.exports = twinbellows;
