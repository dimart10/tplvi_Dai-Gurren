//shemum.js
'use strict'

var terrestrial = require('./terrestrial.js');

function shemum(game, x, y, name, direction){
  terrestrial.call(this, game, x, y, name);

  this.direction=direction;
  this.velocity = 150;
  this.scale.setTo(2.5,2.5);
  this.body.setSize(10, 15, 10, 4);

  this.animations.add('walkRight', [2, 3], 5, true);
  this.animations.add('walkLeft', [0, 1], 5, true);
  if(this.direction==1) this.animations.play('walkRight');
  else if(this.direction==-1) this.animations.play('walkLeft');
}

shemum.prototype = Object.create(terrestrial.prototype);//inherit from terrestrial

shemum.prototype.update = function(){
this.movement();
}

//Walks in the current direction, if it runs into a wall, the direction is inverted
shemum.prototype.movement = function(){
  if(this.body.onWall()) {
    this.direction = this.direction*(-1);
    if(this.direction==1) this.animations.play('walkRight');
    else if(this.direction==-1) this.animations.play('walkLeft');
  }
  this.horizMove(this.velocity, this.direction);
}
module.exports = shemum;
