//pit.js
'use strict'

var entity = require('../entity.js');
var arrow = require('../Scenary/arrow.js');
var config = require('../../config.js');

function pit(game, x, y, name, groups){
  entity.call(this, game, x, y, name);
  this.game = game;
  this.groups=groups;


  this.game.camera.follow(this);

  this.scale.setTo(config.scale, config.scale);
  this.game.physics.arcade.enable(this);
  this.body.setSize(13, 24, 7, 0);
  this.body.collideWorldBounds = false;
  this.body.maxVelocity.y = 800;

  this.newAnimation('stillRight', [7], 0, false, true);
  this.newAnimation('stillLeft', [6], 0, false, false);
  this.newAnimation('walkRight', [10, 9, 8, 7], 15, true, false);
  this.newAnimation('walkLeft', [3, 4, 5, 6], 15, true, false);
  this.newAnimation('stillUp', [37], 0, false, false);
  this.newAnimation('stillDown', [0], 0, false, false);

  this.arrowKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.cursors = this.game.input.keyboard.createCursorKeys(); //TESTIN");

  //PROVISIONAL
  this.jumptimer=0;
  this.jumpTime=10;
  this.direction=1;
  this.arrowtimer=0;
}

pit.prototype = Object.create(entity.prototype); //Inherits from entity

pit.prototype.newAnimation = function (name, frames, fps, repeat, playOnCreate){
  this.animations.add(name, frames, fps, repeat);
  if (playOnCreate) this.animations.play(name);
}

pit.prototype.update = function(){
  this.move();
  this.jump();
  this.arrowKey.onDown.add(this.shoot, this, 0);
  this.arrowtimer++;
}

pit.prototype.move = function(){ //TESTING
  if (this.cursors.left.isDown) {
		    this.body.velocity.x = -200;
        this.animations.play("walkLeft");
        this.direction=-1;
      }
      else if (this.cursors.right.isDown){
		    this.body.velocity.x = 200;
        this.animations.play("walkRight");
        this.direction=1;
      }
      else if(this.cursors.up.isDown){
        this.animations.play("stillUp");
        this.direction=0;
        this.body.velocity.x=0;
      }
      else if(this.cursors.down.isDown){
        this.animations.play("stillDown");
        this.direction=2;
        this.body.velocity.x=0;
      }
      else{
        this.body.velocity.x = 0;
        if (this.animations.name == "walkRight") this.animations.play("stillRight");
        else if (this.animations.name == "walkLeft") this.animations.play("stillLeft");
      }

      //Processes toroidal movement
      this.game.world.wrap(this, 0, false, true, false);
}

pit.prototype.jump = function(){

  if(this.spacebar.isDown && this.body.onFloor()) {
    this.jumptimer=1;
    this.body.velocity.y = -this.body.maxVelocity.y;
  }

  else if(this.spacebar.isDown && (this.jumptimer!=0))  {
      if(this.jumptimer > this.jumpTime){
        this.jumptimer=0;
      }
      else{
        this.jumptimer++; //DELTA TIMEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
        this.body.velocity.y=-900;
      }
    }

  else if (this.jumptimer != 0){
    this.jumptimer=0;
  }
}

pit.prototype.shoot = function(){
  if(this.direction!=2 && this.arrowtimer>=30){
      this.groups.arrows.add(new arrow(this.game, this.position.x,
        this.position.y, "arrow", this.direction));
      this.arrowtimer=0;
    }
}

module.exports = pit;
