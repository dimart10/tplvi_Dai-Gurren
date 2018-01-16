//nettler.js
'use strict'

var terrestrial = require('./terrestrial.js');

function nettler(game, x, y, name, direction, player){
  terrestrial.call(this, game, x, y, name);
  this.player=player;
  this.direction = direction;
  this.scale.setTo(2.5,2.5);
  this.body.setSize(12, 5, 5, 10);
  this.maxHealth=1;
  this.velocity=150;
  this.health=1;
  this.attackDamage=1;
  this.alert=false;
  this.animations.add('walkLeft', [36,37], 5, true);
  this.animations.add('walkRight', [40,41], 5, true);
  this.animations.add('crouchLeft', [38], 0, false);
  this.animations.add('crouchRight', [39], 0, false);
  if(this.direction==1) this.animations.play('walkRight');
  else if(this.direction==-1) this.animations.play('walkLeft');

}

nettler.prototype = Object.create(terrestrial.prototype);//inherit from terrestrial

nettler.prototype.update = function(){
  if (this.inCamera){
    if(!this.alert) this.detectPit();
    else{
      this.movement();

    }
  }
}

nettler.prototype.movement = function(){
  if(this.x > this.player.x) {
      this.direction=-1;
      this.animations.play('walkLeft');
  }
  else {
      this.direction=1;
      this.animations.play('walkRight');
    }
  this.horizMove(this.velocity);
}

nettler.prototype.crouch = function(){
  if(this.direction==1){
    this.animations.play('walkRight');
  }
  else {
    this.animations.play('crouchLeft');
  }
}

nettler.prototype.detectPit = function(){
    if (Math.abs(this.y - this.player.y)<50){
    this.alert = true;
    this.animations.play('crouch');
    this.body.setSize(12, 5, 5, 10);
  }
}


module.exports = nettler;
