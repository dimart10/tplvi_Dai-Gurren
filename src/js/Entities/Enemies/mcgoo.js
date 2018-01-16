//mcgoo.js
'use strict'

var terrestrial = require('./terrestrial.js');
var magmaShot = require('../Scenary/magmaShot.js')

function mcgoo(game, x, y, name, player, groups){
  terrestrial.call(this, game, x, y, name);
  this.groups=groups;
  this.player=player;
  this.scale.setTo(2.5,2.5);
  this.body.setSize(12, 5, 5, 10);
  this.maxHealth=1;
  this.health=1;
  this.attackDamage=1;
  this.attackTimer=0;
  this.aimTimer=0;
  this.alert=false;
  this.animations.add('attack', [84,87], 5, true);
  this.animations.add('crouch', [85,86], 5, true);
  this.animations.play('crouch');

}

mcgoo.prototype = Object.create(terrestrial.prototype);//inherit from terrestrial

mcgoo.prototype.update = function(){
  if (this.inCamera){
    if(!this.alert) this.detectPit();
    else{
      this.attackTimer++;
      if(this.attackTimer>=100){
        this.animations.play('attack');
        this.body.setSize(12, 20, 5, 0);
        this.aimTimer++;
        if(this.aimTimer>=40) this.attack();
      }
    }
  }
}

mcgoo.prototype.detectPit = function(){
    if (Math.abs(this.y - this.player.y)<50){
    this.alert = true;
    this.animations.play('crouch');
    this.body.setSize(12, 5, 5, 10);
  }
}

mcgoo.prototype.attack = function(){
  if(this.x< this.player.x) this.shoot(1);
  else this.shoot(-1);
  this.animations.play('crouch');
  this.body.setSize(12, 5, 5, 10);
  this.body.position.y+=8;
}

mcgoo.prototype.shoot = function(direction){
  this.groups.projectiles.add(new magmaShot(this.game, this.position.x,
    this.position.y, "magmaShot", direction));

  this.attackTimer=0;
  this.aimTimer=0;

}

module.exports = mcgoo;
