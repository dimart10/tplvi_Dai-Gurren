//pit.js
'use strict'

var entity = require('../entity.js');
var arrow = require('../Scenary/arrow.js');
var config = require('../../config.js');
var HUD = require('../../HUD/hud.js');

function pit(game, x, y, name){
  entity.call(this, game, x, y, name);

  this.game.camera.follow(this);

  //Set scale and pit size
  this.scale.setTo(config.scale, config.scale);
  this.game.physics.arcade.enable(this);
  this.body.setSize(config.normalW, config.normalH, config.normalOX, config.normalOY);
  this.body.collideWorldBounds = false;
  this.body.maxVelocity.y = config.maxVelocity; //To avoid tunneling

  //Set animations
  this.newAnimation('stillRight', [7], 0, false, true);
  this.newAnimation('stillLeft', [6], 0, false, false);
  this.newAnimation('walkRight', [10, 9, 8, 7], 15, true, false);
  this.newAnimation('walkLeft', [3, 4, 5, 6], 15, true, false);
  this.newAnimation('stillUp', [37], 0, false, false);
  this.newAnimation('stillDown', [0], 0, false, false);
  this.newAnimation('jumpLeft', [2, 1], 0, false, false);
  this.newAnimation('jumpRight', [11, 12], 0, false, false);

  //Set controls
  this.arrowKey = this.game.input.keyboard.addKey(config.shootKey);
  this.spacebar = this.game.input.keyboard.addKey(config.jumpKey);
  this.cursors = this.game.input.keyboard.createCursorKeys();
  this.arrowKey.onDown.add(this.shoot, this, 0);

  //Set initial health values
  this.maxHealth = config.initialPitHealth;
  this.health = config.initialPitHealth;

  //Set timers and some other variables to its initial value
  this.jumptimer=0;
  this.direction=config.initialDirection;
  this.arrowTimer=0;
  this.canBeHit = true;
  this.hitTimer = 0;

  this.state = config.initialState;
}

pit.prototype = Object.create(entity.prototype); //Inherits from entity

pit.prototype.newAnimation = function (name, frames, fps, repeat, playOnCreate){
  this.animations.add(name, frames, fps, repeat);
  if (playOnCreate) this.animations.play(name);
}

pit.prototype.update = function(){
  this.move();
  this.jump();
  this.hitCount();
  this.handleDead();

  this.arrowTimer++;
}

pit.prototype.move = function(){
  if (this.cursors.left.isDown) {
		    this.body.velocity.x = -config.movementSpeed;
        if (this.state == "normal") this.animations.play("walkLeft");
        this.direction=-1;
        //if(!this.game.walk.isPlaying) this.game.walk.loopFull();
      }
      else if (this.cursors.right.isDown){
		    this.body.velocity.x = config.movementSpeed;
        if (this.state == "normal") this.animations.play("walkRight");
        this.direction=1;
        //if(!this.game.walk.isPlaying) this.game.walk.loopFull();
      }
      else if(this.cursors.up.isDown){
        if (this.state == "normal") this.animations.play("stillUp");
        this.direction=0;
        this.body.velocity.x=0;
      }
      else if(this.cursors.down.isDown){
        if (this.state == "normal") this.animations.play("stillDown");
        this.direction=2;
        this.body.velocity.x=0;
      }

      else{
        this.body.velocity.x = 0;

        if (this.state == "normal"){
          if (this.direction==1) this.animations.play("stillRight");
          else if (this.direction==-1) this.animations.play("stillLeft");
        }
      }

      if (this.direction == 2){
        this.body.setSize(config.crouchW, config.crouchH, config.crouchOX, config.crouchOY);
      } else{
        this.body.setSize(config.normalW, config.normalH, config.normalOX, config.normalOY);
      }

      //Processes toroidal movement
      this.game.world.wrap(this, 0, false, true, false);
}

pit.prototype.jump = function(){
  if (this.state = "jumping" && this.body.velocity.y >= 0) this.state = "normal";

  if(this.spacebar.isDown && this.body.onFloor()) {
    this.state = "jumping";
    this.jumptimer=1;
    this.body.velocity.y = -this.body.maxVelocity.y;
    this.game.jump.play();

    if (this.direction != 1 && this.direction != -1) this.direction = 1;

    if (this.direction == -1)this.animations.play('jumpLeft');
    else this.animations.play('jumpRight');
  }

  else if(this.spacebar.isDown && (this.jumptimer!=0))  {
      if(this.jumptimer > config.jumpTime){
        this.jumptimer=0;
      }
      else{
        this.jumptimer++;
        this.body.velocity.y=-900;
      }
    }

  else if (this.jumptimer != 0){
    this.jumptimer=0;
  }
}

pit.prototype.handleDead = function(){
  if (this.health <= 0){
    if(this.game.bottles>0){
      this.health+=7;
      this.game.bottles--;
      this.updateHealthBar();
    }
    else{
    this.health = 1; //If not set to a value higher than 0, the restart
                    //will enter an infinite loop
    this.game.sound.stopAll();
    this.game.state.restart(false, false);
    }
  }
}

pit.prototype.damage = function(points){
  if (this.canBeHit){
    this.health -= points;
    this.game.pit_hit.play();
    this.updateHealthBar();
    this.canBeHit = false;
  }
}

pit.prototype.updateHealthBar = function(){
  HUD.myHealthBar.setPercent((this.health/this.maxHealth) * 100);
}

pit.prototype.hitCount = function(){
  if (!this.canBeHit){
    if (this.hitTimer < config.framesBetweenHit) this.hitTimer++;
    else{
     this.canBeHit = true;
     this.hitTimer = 0;
    }
  }
}

pit.prototype.shoot = function(){
  if(this.direction!=2 && this.arrowTimer>=30){
      this.game.groups.arrows.add(new arrow(this.game, this.position.x,
        this.position.y -4, "arrow", this.direction));
      this.arrowTimer=0;
      this.game.arrow_shot.play();
    }
}

module.exports = pit;
