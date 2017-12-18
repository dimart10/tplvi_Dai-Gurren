//reapette.js
'use strict'

var flying = require('./flying.js');

function reapette(game, x, y, name, player){
  flying.call(this, game, x, y, name);

  this.player=player;
  this.goalX=this.player.x;
  this.goalY=this.player.y;
  this.velocity=3;
  this.radius=300;
  this.scale.setTo(2.5, 2.5);
  this.body.setSize(10,20, 5, 0);
  this.maxHealth=1;
  this.health=1;
  this.attackDamage=1;


  this.animations.add('right', [75], 0, false);
  this.animations.add('left', [74], 0, false);
  if(this.x>this.player.x) this.animations.play('left');
  else if(this.x<this.player.x) this.animations.play('right');
}

reapette.prototype = Object.create(flying.prototype);

reapette.prototype.update = function(){
  this.swoop();
  if(this.x>this.player.x) this.animations.play('left');
  else if(this.x<this.player.x) this.animations.play('right');
}

module.exports = reapette;
