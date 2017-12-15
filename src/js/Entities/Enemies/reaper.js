//reaper.js
'use strict'

var terrestrial = require('./terrestrial.js');
var reapette = require('./reapette.js');

function reaper(game, x, y, name, direction, player){
  terrestrial.call(this, game, x, y, name);

  this.player=player;
  this.turn=false;
  this.turnTimer=0;
  this.alertTimer=0;
  this.alert=false;
  this.direction=direction;
  this.velocity = 50;
  this.scale.setTo(2.5,2.5);
  this.body.setSize(15, 24, 5, -1);

  this.animations.add('patrolRight', [25], 0, false);
  this.animations.add('alertRight', [26,27], 5, true);
  this.animations.add('patrolLeft', [24], 0, false);
  this.animations.add('alertLeft', [22,23], 5, true);
  if(this.direction==1) this.animations.play('patrolRight');
  else if(this.direction==-1) this.animations.play('patrolLeft');
}

reaper.prototype = Object.create(terrestrial.prototype);//inherit from terrestrial

reaper.prototype.update = function(){

if(!this.alert) this.detectPit();
this.movement();
}



reaper.prototype.detectPit = function(){
  if (Math.abs(this.y - this.player.y)<20) {
        if (this.player.x > this.x) {
          if(this.direction==1) this.onAlert();
        }
        else if(this.direction==-1) this.onAlert();
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
  if(this.alertTimer>300) this.exitAlert();
}
//console.log(this.turn);
if(!this.turn) {
   this.horizMove(this.velocity, this.direction);
   if(this.turnTimer>300) this.onTurn();
}
if(this.turn && this.turnTimer>100) this.exitTurn();
this.turnTimer++;
}

reaper.prototype.onAlert = function(){
    this.alert=true;
    this.turn=false;
    this.turnTimer=0;
    if(this.direction==1) this.animations.play('alertRight');
    else if(this.direction==-1) this.animations.play('alertLeft');
    this.velocity*=3;
    this.myReapette = new reapette(this.game, this.x, this.y -200, 'enemies', this.player);}

reaper.prototype.exitAlert = function(){
  this.alert=false;
  this.alertTimer=0;
  this.velocity/=3;
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
