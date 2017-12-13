//reaper.js
'use strict'

var terrestrial = require('./terrestrial.js');

function reaper(game, x, y, name, direction){
  terrestrial.call(this, game, x, y, name);

  this.alertTimer=0;
  this.alert=false;
  this.direction=direction;
  this.velocity = 50;
  this.scale.setTo(2.5,2.5);
  this.body.setSize(15, 24, 5, -1);

  this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  this.animations.add('patrolRight', [25], 0, false);
  this.animations.add('alertRight', [26,27], 5, true);
  this.animations.add('patrolLeft', [24], 0, false);
  this.animations.add('alertLeft', [22,23], 5, true);
  if(this.direction==1) this.animations.play('patrolRight');
  else if(this.direction==-1) this.animations.play('patrolLeft');
}

reaper.prototype = Object.create(terrestrial.prototype);//inherit from terrestrial

reaper.prototype.update = function(){
if(!this.alert)this.detectPit();
if(!this.alert) this.spacebar.onDown.add(this.onAlert, this, 0);
this.movement();
}

reaper.prototype.onAlert = function(){
    if(this.direction==1) this.animations.play('alertRight');
    else if(this.direction==-1) this.animations.play('alertLeft');
    this.velocity*=2;
    //spawn reaperets
}

reaper.prototype.exitAlert = function(){

}

reaper.prototype.detectPit = function(){
  //CODE THAT LOOKS FOR PIT
if(false){
  this.alert=true;
  this.onAlert();
}
}

reaper.prototype.movement = function(){
if(!this.alert){
  if(this.body.onWall()) {
    this.direction = this.direction*(-1);
    if(this.direction==1) this.animations.play('patrolRight');
    else if(this.direction==-1) this.animations.play('patrolLeft');
  }
}
else{
  this.alertTimer++;
  if(this.alertTimer>20) {
    this.alert=false;
    this.velocity/=2;
  }
}
  this.horizMove(this.velocity, this.direction);
}
module.exports = reaper;
