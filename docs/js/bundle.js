(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    this.body.velocity.y =-this.body.maxVelocity.y;
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
        this.body.velocity.y =-this.body.maxVelocity.y;
      }
    }

  else if (this.jumptimer != 0){
    this.jumptimer=0;
  }
}

pit.prototype.handleDead = function(){
  if (this.health <= 0){
    if(this.game.bottles>0){
      this.health+=this.maxHealth;
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

},{"../../HUD/hud.js":25,"../../config.js":31,"../Scenary/arrow.js":13,"../entity.js":24}],2:[function(require,module,exports){
//enemy.js
'use strict';

var entity = require('../entity.js');
var heart = require('../Scenary/heart.js');
var config = require('../../config.js');

function enemy(game, x, y, name){
  entity.call(this, game, x, y, name);
  this.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = false;
  this.maxHealth;
  this.attackDamage;
  this.alive=true;
  this.health;
  this.heartValue=0;

}

enemy.prototype = Object.create(entity.prototype);//inherit from entity

//Method that deals the given damage and destroys this if health<=0
enemy.prototype.receiveDamage =function(damage){
  this.health-=damage;
  this.game.enemy_damage.play();

  if(this.health<=0) {
    this.game.enemy_death.play();
    if(this.heartValue!=0){
      this.game.groups.items.add(new heart(this.game, this.position.x, this.position.y, 'heart', this.heartValue));
    }
    this.destroy();
  }
}

module.exports = enemy;

},{"../../config.js":31,"../Scenary/heart.js":17,"../entity.js":24}],3:[function(require,module,exports){
//flying.js
'use strict';

var enemy = require('./enemy.js');
var config = require('../../config.js');

function flying(game, x, y, name, player){
  enemy.call(this, game, x, y, name);
  this.body.allowGravity= false;
  this.goalX;
  this.goalY;
  this.velocity;
  this.radius;
  this.rotateangle =0;
}

flying.prototype = Object.create(enemy.prototype);//inherit from enemy

//goal does a W trajectory around the player, this chases the goal
flying.prototype.swoop = function(){
  var fixRatio= this.radius;
  if(Math.round(Math.cos((this.rotateangle)))==-1) fixRatio*=-1;
  this.goalX = this.radius * Math.cos((this.rotateangle/1.5)) + this.player.x + fixRatio;
  this.goalY = -this.radius * Math.cos((this.rotateangle)) + this.player.y;
  if(this.x< this.goalX) this.x+=this.velocity;
  else if(this.x> this.goalX) this.x-=this.velocity;
  if(this.y< this.goalY) this.y+=this.velocity;
  else if(this.y> this.goalY) this.y -= this.velocity;

  this.rotateangle+=.02;
}


module.exports = flying;

},{"../../config.js":31,"./enemy.js":2}],4:[function(require,module,exports){
//mcgoo.js
'use strict'

var terrestrial = require('./terrestrial.js');
var magmaShot = require('../Scenary/magmaShot.js');
var config = require('../../config.js');

function mcgoo(game, x, y, name, player){
  terrestrial.call(this, game, x, y, name);
  this.player=player;
  this.scale.setTo(config.scale2, config.scale2);
  this.body.setSize(config.mcgooW, config.mcgooH, config.mcgooOX, config.mcgooOY);
  this.maxHealth=config.mcgooMaxHealth;
  this.health=this.maxHealth;
  this.heartValue=config.mcgooHeartValue;
  this.attackDamage=config.mcgooAttackDamage;

  this.animations.add('attack', [84,87], 5, true);
  this.animations.add('crouch', [85,86], 5, true);
  this.animations.play('crouch');

  this.alert=false;
  this.attackTimer=0;
  this.aimTimer=0;
}

mcgoo.prototype = Object.create(terrestrial.prototype);//inherit from terrestrial

mcgoo.prototype.update = function(){
  if (this.inCamera){
    if(!this.alert) this.detectPit();
    else{
      this.attackTimer++;

      if(this.attackTimer>=config.mcgooTimeBeetweenAttacks){
        this.animations.play('attack');
        this.body.setSize(config.mcgooW, config.mcgooH, config.mcgooOX, config.mcgooOY);
        this.aimTimer++;
        if(this.aimTimer>=config.mcgooAimTime) this.attack();
      }
    }
  }
}

//Looks for pit in the y ais
mcgoo.prototype.detectPit = function(){
  if (Math.abs(this.y - this.player.y) < config.mcgooDetectionRange){
    this.alert = true;
    this.animations.play('crouch');
    this.body.setSize(config.mcgooHiddenW, config.mcgooHiddenH, config.mcgooHiddenOX, config.mcgooHiddenOY);
  }
}

//Fires a magmashot at pit and changes the animation
mcgoo.prototype.attack = function(){
  if(this.x< this.player.x) this.shoot(1);
  else this.shoot(-1);
  this.animations.play('crouch');
  this.body.setSize(config.mcgooHiddenW, config.mcgooHiddenH, config.mcgooHiddenOX, config.mcgooHiddenOY);
  this.body.position.y+=config.mcgooHiddenOY;
}

//Fires a magma shot in the given direction
mcgoo.prototype.shoot = function(direction){
  this.game.groups.projectiles.add(new magmaShot(this.game, this.position.x,
    this.position.y, "magmaShot", direction));

  this.attackTimer=0;
  this.aimTimer=0;

}

module.exports = mcgoo;

},{"../../config.js":31,"../Scenary/magmaShot.js":20,"./terrestrial.js":10}],5:[function(require,module,exports){
//monoeye.js
'use strict'

var flying = require('./flying.js');
var config = require('../../config.js');

function monoeye(game, x, y, name, player){
  flying.call(this, game, x, y, name);

  this.player=player;
  this.goalX=this.player.x;
  this.goalY=this.player.y;
  this.velocity=config.monoeyeVelocity;
  this.radius=config.monoeyeRadius;
  this.scale.setTo(config.scale2, config.scale2);
  this.body.setSize(config.monoeyeW, config.monoeyeH, config.monoeyeOX, config.monoeyeOY);
  this.maxHealth=config.monoeyeMaxHealth;
  this.health=this.maxHealth;
  this.heartValue=config.monoeyeHeartValue;
  this.attackDamage=config.monoeyeAttackDamage;


  this.animations.add('right', [21], 0, false);
  this.animations.add('left', [20], 0, false);

  if(this.x>this.player.x) this.animations.play('left');
  else if(this.x<this.player.x) this.animations.play('right');
}

monoeye.prototype = Object.create(flying.prototype);

monoeye.prototype.update = function(){
  if (this.inCamera){
    this.swoop();
    if(this.x>this.player.x) this.animations.play('left');
    else if(this.x<this.player.x) this.animations.play('right');
    }
  }

module.exports = monoeye;

},{"../../config.js":31,"./flying.js":3}],6:[function(require,module,exports){
//nettler.js
'use strict'

var terrestrial = require('./terrestrial.js');
var config = require('../../config.js');

function nettler(game, x, y, name, direction, player){
  terrestrial.call(this, game, x, y, name);
  this.player=player;
  this.direction = direction;
  this.scale.setTo(config.scale2, config.scale2);
  this.body.setSize(config.nettlerW, config.nettlerH, config.nettlerOX, config.nettlerOY);
  this.maxHealth=config.nettlerMaxHealth;
  this.health = this.maxHealth;
  this.velocity=config.nettlerVelocity;
  this.attackDamage=config.nettlerAttackDamage;
  this.heartValue=config.nettlerHeartValue;

  this.animations.add('walkLeft', [36,37], 5, true);
  this.animations.add('walkRight', [40,41], 5, true);
  this.animations.add('crouchLeft', [38], 0, false);
  this.animations.add('crouchRight', [39], 0, false);

  if(this.direction==1) this.animations.play('walkRight');
  else if(this.direction==-1) this.animations.play('walkLeft');

  this.alert=false;
  this.crouching=false;
  this.crouchTimer=0;
}

nettler.prototype = Object.create(terrestrial.prototype);//inherit from terrestrial

nettler.prototype.update = function(){
  if (this.inCamera){
    if(!this.alert) {
      this.regularMovement();
      this.detectPit();
    }
    else{
      if(!this.crouching && this.player.arrowTimer<=8) {
        this.crouching=true;
        this.crouch();
      }
      if(this.crouching){
        this.crouchTimer++;
        if(this.crouchTimer>=config.nettlerCrouchTime) {
          this.crouching = false;
          this.crouchTimer=0;
          this.body.setSize(config.nettlerW, config.nettlerH, config.nettlerOX, config.nettlerOY);
        }
      }
      this.alertMovement();
    }
  }
}

//Walks towards pit
nettler.prototype.alertMovement = function(){
  if(this.x > this.player.x) {
      this.direction=-1;
      if(!this.crouching) this.animations.play('walkLeft');
  }
  else {
      this.direction=1;
      if(!this.crouching) this.animations.play('walkRight');
    }
  this.horizMove(this.velocity);
}

//Walks in the current direction, if it runs into a wall, the direction is inverted
nettler.prototype.regularMovement = function(){
  if(this.body.onWall()) {
    this.direction = this.direction*(-1);
    if(this.direction==1) this.animations.play('walkRight');
    else if(this.direction==-1) this.animations.play('walkLeft');
  }
  this.horizMove(this.velocity);
}

//When an arrow is fired, this crouches
nettler.prototype.crouch = function(){
  if(this.direction==1) this.animations.play('crouchRight');
  else this.animations.play('crouchLeft');

  this.body.setSize(config.nettlerCrouchW, config.nettlerCrouchH, config.nettlerCrouchOX, config.nettlerCrouchOY);
  this.body.position.y+=4;
}

//Looks for pit in its y position and its direction
nettler.prototype.detectPit = function(){
    if (Math.abs(this.y - this.player.y) < config.nettlerRangeDetection){
      if (this.player.x > this.x) {
        if(this.direction==1) this.alert=true;

      else if(this.direction==-1) this.alert=true;
    }
  }
}


module.exports = nettler;

},{"../../config.js":31,"./terrestrial.js":10}],7:[function(require,module,exports){
//reaper.js
'use strict'

var terrestrial = require('./terrestrial.js');
var reapette = require('./reapette.js');
var config = require('../../config.js');

function reaper(game, x, y, name, direction, player, edgeLayer){
  terrestrial.call(this, game, x, y, name);
  this.player=player;

  this.velocity = config.reaperVelocity;
  this.scale.setTo(config.scale2, config.scale2);
  this.body.setSize(config.reaperW, config.reaperH, config.reaperOX, config.reaperOY);
  this.maxHealth=config.reaperMaxHealth;
  this.health=this.maxHealth;
  this.attackDamage=config.reaperAttackDamage;
  this.heartValue=config.reaperHeartValue;

  this.animations.add('patrolRight', [25], 0, false);
  this.animations.add('alertRight', [26,27], 5, true);
  this.animations.add('patrolLeft', [24], 0, false);
  this.animations.add('alertLeft', [22,23], 5, true);

  if(this.direction==1) this.animations.play('patrolRight');
  else if(this.direction==-1) this.animations.play('patrolLeft');

  this.turn=false;
  this.turnTimer=0;
  this.alertTimer=0;
  this.alert=false;
  this.direction=direction;

  this.edgeLayer = edgeLayer;
}

reaper.prototype = Object.create(terrestrial.prototype);//inherit from terrestrial

//if reaper is killed, the music stops
reaper.prototype.receiveDamage = function(damage){
  if (this.health <= 0){
    this.game.reaper_spotted.stop();
    this.game.underworld.loopFull();
  }

  terrestrial.prototype.receiveDamage.call(this, damage);
}

reaper.prototype.update = function(){
  if (this.inCamera){
    if(!this.alert) this.detectPit();
    this.game.physics.arcade.collide(this, this.edgeLayer);
      this.movement();
  }
}


//looks for pit in the y axis and its direction
reaper.prototype.detectPit = function(){
  if (Math.abs(this.y - this.player.y) < config.reaperDetectionRange) {
        if (this.player.x > this.x) {
          if(this.direction==1) this.onAlert();
        }
        else if(this.direction==-1) this.onAlert();
    }
}

//Moves until it runs into a wall or edge, then in switches direction
reaper.prototype.movement = function(){
if(!this.alert){
  if(this.body.onWall()) {
    this.direction = this.direction * (-1);
    if(this.direction==1) this.animations.play('patrolRight');
    else if(this.direction==-1) this.animations.play('patrolLeft');
  }
}
else{
  this.alertTimer++;
  if(this.alertTimer > config.reaperTimeToTurn) this.exitAlert();
}
if(!this.turn) {
   this.horizMove(this.velocity);
   if(this.turnTimer > config.reaperTimeToTurn) this.onTurn();
}
if(this.turn && this.turnTimer > config.reaperTurnTime) this.exitTurn();
  this.turnTimer++;
}

//When alerted it spawns two reaettes, changes its movement and animation
//and switches the music and
reaper.prototype.onAlert = function(){
    this.game.reaper_spotted.loopFull();
    this.game.underworld.stop();
    this.alert=true;
    this.turn=false;
    this.turnTimer=0;
    if(this.direction==1) this.animations.play('alertRight');
    else if(this.direction==-1) this.animations.play('alertLeft');
    this.velocity*=config.reaperVelocityMultiplier
    ;
    this.game.groups.enemies.add(new reapette(this.game, this.x, this.y -200, 'enemies', this.player));
    this.game.groups.enemies.add(new reapette(this.game, this.x+100, this.y -230, 'enemies', this.player));
  }

//When the alert ends its behaviour and the music return to normal
reaper.prototype.exitAlert = function(){
  this.game.reaper_spotted.stop();
  this.game.underworld.loopFull();
  this.alert=false;
  this.alertTimer=0;
  this.velocity/=config.reaperVelocityMultiplier;

  if(this.direction==1) this.animations.play('patrolRight');
  else if(this.direction==-1)this.animations.play('patrolLeft');
}

//On turn it turns and waits a few moments
reaper.prototype.onTurn = function(){
  this.turn=true;
  this.body.velocity.x=0;
  this.turnTimer=0;
  if(this.direction==1)
  {this.direction=-1; this.animations.play('patrolLeft');}
  else if(this.direction==-1)
  {this.direction=1; this.animations.play('patrolRight');}
}

//After turning he returns to patrolling
reaper.prototype.exitTurn = function(){
  this.turn=false;
  this.turnTimer=0;
  if(this.direction==1)
  {this.direction=-1; this.animations.play('patrolLeft');}
  else if(this.direction==-1)
  {this.direction=1; this.animations.play('patrolRight');}
}

module.exports = reaper;

},{"../../config.js":31,"./reapette.js":8,"./terrestrial.js":10}],8:[function(require,module,exports){
//reapette.js
'use strict'

var flying = require('./flying.js');
var config = require('../../config.js');

function reapette(game, x, y, name, player){
  flying.call(this, game, x, y, name);

  this.player=player;
  this.goalX=this.player.x;
  this.goalY=this.player.y;
  this.velocity=config.reapetteVelocity;
  this.radius=config.reapetteRadius;
  this.scale.setTo(config.scale2, config.scale2);
  this.body.setSize(config.reapetteW, config.reapetteH, config.reapetteOX, config.reapetteOY);
  this.maxHealth=config.reapetteMaxHealth;
  this.health=this.maxHealth;
  this.attackDamage=config.reapetteAttackDamage;
  this.heartValue=config.reapetteHeartValue;

  this.animations.add('right', [75], 0, false);
  this.animations.add('left', [74], 0, false);

  if(this.x>this.player.x) this.animations.play('left');
  else if(this.x<this.player.x) this.animations.play('right');
}

reapette.prototype = Object.create(flying.prototype);

reapette.prototype.update = function(){
  if (this.inCamera){
    if(!this.alert){
      this.swoop();
      if(this.x>this.player.x) this.animations.play('left');
      else if(this.x<this.player.x) this.animations.play('right');
    }
  }
}

module.exports = reapette;

},{"../../config.js":31,"./flying.js":3}],9:[function(require,module,exports){
//shemum.js
'use strict'

var terrestrial = require('./terrestrial.js');
var config = require('../../config.js');

function shemum(game, x, y, name, direction){
  terrestrial.call(this, game, x, y, name);

  this.direction=direction;
  this.velocity = config.shemumVelocity;
  this.scale.setTo(config.scale2, config.scale2);
  this.body.setSize(config.shemumW, config.shemumH, config.shemumOX, config.shemumOY);
  this.maxHealth=config.shemumMaxHealth;
  this.health=this.maxHealth;
  this.attackDamage=config.shemumAttackDamage;
  this.heartValue=config.shemumHeartValue;

  this.animations.add('walkRight', [2, 3], 5, true);
  this.animations.add('walkLeft', [0, 1], 5, true);

  if(this.direction==1) this.animations.play('walkRight');
  else if(this.direction==-1) this.animations.play('walkLeft');
}

shemum.prototype = Object.create(terrestrial.prototype);//inherit from terrestrial

shemum.prototype.update = function(){
  if (this.inCamera){
      this.movement();
  }
}

//Walks in the current direction, if it runs into a wall, the direction is inverted
shemum.prototype.movement = function(){
  if(this.body.onWall()) {
    this.direction = this.direction*(-1);
    if(this.direction==1) this.animations.play('walkRight');
    else if(this.direction==-1) this.animations.play('walkLeft');
  }
  this.horizMove(this.velocity);
}
module.exports = shemum;

},{"../../config.js":31,"./terrestrial.js":10}],10:[function(require,module,exports){
//terrestrial.js
'use strict';

var enemy = require('./enemy.js');
var config = require('../../config.js');

function terrestrial(game, x, y, name){
  enemy.call(this, game, x, y, name);
  this.body.maxVelocity.y = config.maxVelocity;
}

terrestrial.prototype = Object.create(enemy.prototype);//inherit from enemy

//Moves toroidally either right or left depeneding on the direction given at
//given the velocity
terrestrial.prototype.horizMove = function(velocity){
  if(this.direction==-1){
    this.body.velocity.x=- velocity;
  }
  else if(this.direction==1){
    this.body.velocity.x= velocity;
  }
  this.game.world.wrap(this, 0, false, true, false);
}

module.exports = terrestrial;

},{"../../config.js":31,"./enemy.js":2}],11:[function(require,module,exports){
//twinbellows.js
'use strict'

var terrestrial = require('./terrestrial.js');
var magmaShot = require('../Scenary/magmaShot.js');
var config = require('../../config.js');

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

  twinbellows.prototype.receiveDamage = function(damage){
    this.health-=damage;
    this.game.boss_damage.play();

    if(this.health<=0) {
      this.game.boss_death.play();
      this.destroy();
    }
  }

//Fires at pit's direction
twinbellows.prototype.attack = function(){
  if(this.x< this.player.x) this.shoot(1);
  else this.shoot(-1);
}

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

},{"../../config.js":31,"../Scenary/magmaShot.js":20,"./terrestrial.js":10}],12:[function(require,module,exports){
//angelFeather.js
'use strict'

var item = require('./item.js');
var config = require('../../config.js');

function angelFeather(game, x, y, name){
  item.call(this, game, x, y, name);
  this.animations.add('angelFeather', [0], 0, false, 1);
  this.animations.play('angelFeather');
  this.scale.setTo(config.scale2, config.scale2);
}

angelFeather.prototype = Object.create(item.prototype); //inherit from item

angelFeather.prototype.update = function(){

}

angelFeather.prototype.effect = function(){
  this.game.power_up.play();
}


module.exports = angelFeather;

},{"../../config.js":31,"./item.js":18}],13:[function(require,module,exports){
//arrow.js
'use strict'

var entity = require('../entity.js');
var config = require('../../config.js')

function arrow(game, x, y, name, direction){
  this.direction = direction;
  this.attackDamage=config.arrowAttackDamage;

  if(this.direction==1){
    entity.call(this, game, x+25, y, name);
    this.initialPosition = x;
  }
  else if (this.direction==-1){
    entity.call(this, game, x-25, y, name);
    this.initialPosition = x;
  }
  else if (this.direction==0){
    entity.call(this, game, x, y-35, name);
    this.initialPosition = y;
  }
  else if(this.direction==2){
    entity.call(this, game, x, y, name);
    this.initialPosition = y;
  }

  this.maximumDistance = config.arrowDistance;

  game.physics.arcade.enable(this);
  this.body.allowGravity = false;

  if(direction==0) this.angle=-90;
  else if(direction==-1) this.angle=180;
}

arrow.prototype = Object.create(entity.prototype);

arrow.prototype.update = function(){
  this.move();
  this.cycleOfLife();
}

//the arrow moves depending on its direction
arrow.prototype.move = function(){
  if (this.direction == 1) this.body.velocity.x = config.arrowVelocity;
  else if(this.direction==-1) this.body.velocity.x = -config.arrowVelocity;
  else if(this.direction==0) this.body.velocity.y = -config.arrowVelocity;
  else if (this.direction==2) this.body.velocity.y = config.arrowVelocity;
}

//The arrow is destroyed after traveling a certain distance
arrow.prototype.cycleOfLife = function(){
  var currentPosition;
  if (this.direction == 1 || this.direction == -1){
    currentPosition = this.x;
  } else{
    currentPosition = this.y;
  }
  if (Math.abs(currentPosition - this.initialPosition) >= this.maximumDistance)
    this.kill();
}

//When the arrow hits an enemy it deals damage and is destroyed
//if the sacredBow is not equiped
arrow.prototype.onHit = function(){
  var damage = this.attackDamage + this.game.bonusDamage;
  if(!this.game.hasSacredBow) this.destroy();
  
  return damage;
}

module.exports = arrow;

},{"../../config.js":31,"../entity.js":24}],14:[function(require,module,exports){
//barrel.js
'use strict'

var item = require('./item.js');
var config = require('../../config.js');

function barrel(game, x, y, name){
  item.call(this, game, x, y, name);
  this.scale.setTo(config.scale2, config.scale2);
}

barrel.prototype = Object.create(item.prototype); //inherit from item

barrel.prototype.update = function(){

}

//increases the number of bottles you can carry
barrel.prototype.effect = function(){
  this.game.maxBottles=config.maxBottles;
  this.game.power_up.play();
}


module.exports = barrel;

},{"../../config.js":31,"./item.js":18}],15:[function(require,module,exports){
//bottle.js
'use strict'

var item = require('./item.js');
var config = require('../../config.js');

function bottle(game, x, y, name, player){
  item.call(this, game, x, y, name);
  this.animations.add('bottle', [0], 0, false, 1);
  this.scale.setTo(config.scale2, config.scale2);
  this.player = player;
}

bottle.prototype = Object.create(item.prototype); //inherit from item

bottle.prototype.update = function(){

}

//increases the number of bottles you are carrying (below maximum)
bottle.prototype.effect = function(){
  this.game.bottles++;
  if(this.game.bottles>this.game.maxBottles) {
    this.game.bottles=this.game.maxBottles;
  }

  this.game.get_item.play();
}


module.exports = bottle;

},{"../../config.js":31,"./item.js":18}],16:[function(require,module,exports){
//chalice.js
'use strict'

var item = require('./item.js');
var config = require('../../config.js');

function chalice(game, x, y, name, player){
  item.call(this, game, x, y, name);
  this.animations.add('chalice', [1], 0, false);
  this.animations.play('chalice');
  this.scale.setTo(config.scale2, config.scale2);
  this.player = player;
}

chalice.prototype = Object.create(item.prototype); //inherit from item

chalice.prototype.update = function(){

}

//heals the player for the given amount
chalice.prototype.effect = function(){
  this.player.health += config.chacliceHealing;
  if(this.player.health > this.player.maxHealth) {
    this.player.health = this.player.maxHealth;
  }
  this.player.updateHealthBar();
  this.game.get_item.play();
}


module.exports = chalice;

},{"../../config.js":31,"./item.js":18}],17:[function(require,module,exports){
//heart.js
'use strict'

var item = require('./item.js');
var config = require('../../config.js');

function heart(game, x, y, name, value){
  item.call(this, game, x, y, name);
  this.value = value;
  this.scale.setTo(config.scale2, config.scale2);

  this.animations.add('small', [0], 0, false);
  this.animations.add('medium', [1], 0, false);
  this.animations.add('big', [2], 0, false);

  if(this.value==1)this.animations.play('small');
  else if (this.value==5)this.animations.play('medium');
  else if (this.value==10)this.animations.play('big');

  this.timer=0;
}

heart.prototype = Object.create(item.prototype); //inherit from item

heart.prototype.update = function(){
this.cycleOfLife();
}

//increases the amount of heart by its value
heart.prototype.effect = function(){
  this.game.hearts+=this.value;
  this.game.get_item.play();
}

//it dissapears after a given time
heart.prototype.cycleOfLife = function(){
  this.timer++;
  if(this.timer >= config.heartTime) this.destroy();
}

module.exports = heart;

},{"../../config.js":31,"./item.js":18}],18:[function(require,module,exports){
//item.js
'use strict'

var entity = require('../entity.js');
var config = require('../../config.js');

function item(game, x, y, name){
  entity.call(this, game, x, y, name);
  game.physics.arcade.enable(this);
  this.body.allowGravity = false;
}

item.prototype = Object.create(entity.prototype);

item.prototype.update = function(){
}

//when a item is picked up it does its effect and is destroyed
item.prototype.onPickUp = function(){
  this.effect();
  this.destroy();
}

item.prototype.effect = function(){
}


module.exports = item;

},{"../../config.js":31,"../entity.js":24}],19:[function(require,module,exports){
//levelEnd.js

var item = require('./item.js');
var config = require('../../config.js');

function levelEnd(game, x, y, name, nextState){
  item.call(this, game, x, y, name);
  this.nextState = nextState;
}

levelEnd.prototype = Object.create(item.prototype);

levelEnd.prototype.effect = function(){
  this.game.newLevel = true;
  this.game.state.start(this.nextState);
}

module.exports = levelEnd;

},{"../../config.js":31,"./item.js":18}],20:[function(require,module,exports){
//magmaShot.js
'use strict'

var entity = require('../entity.js');
var config = require('../../config.js');

function magmaShot(game, x, y, name, direction){
  this.direction = direction;
  this.attackDamage = config.magmaShotAttackDamage;

  if(this.direction==1){
    entity.call(this, game, x + config.magmaShotOffset, y, name);
    this.initialPosition = x;
  }
  else if (this.direction==-1){
    entity.call(this, game, x - config.magmaShotOffset, y, name);
    this.initialPosition = x;
  }

  game.physics.arcade.enable(this);
  this.body.allowGravity = false;

}

magmaShot.prototype = Object.create(entity.prototype);

magmaShot.prototype.update = function(){
  this.move();
  this.cycleOfLife();
}

//moves in its direction
magmaShot.prototype.move = function(){
  if (this.direction == 1) this.body.velocity.x = config.magmaShotVelocity;
  else if(this.direction==-1) this.body.velocity.x = -config.magmaShotVelocity;
}

//dissapears after traveling a certain distance
magmaShot.prototype.cycleOfLife = function(){
  var currentPosition;
  if (this.direction == 1 || this.direction == -1){
    currentPosition = this.x;
  } else{
    currentPosition = this.y;
  }
  if (Math.abs(currentPosition - this.initialPosition) >= config.magmaShotDistance)
    this.kill();
}

module.exports = magmaShot;

},{"../../config.js":31,"../entity.js":24}],21:[function(require,module,exports){
//movingPlatform.js
'use strict';

var entity = require('../entity.js');
var config = require('../../config.js');

function movingPlatform(game, x, y, name){
  entity.call(this, game, x, y, name);
  this.game.physics.arcade.enable(this);
  this.scale.setTo(config.scale2, config.scale2);
  this.body.allowGravity = false;
  this.direction=-1;
  this.velocity=config.movingPlatformVelocity;
  this.body.collideDown=false;
  this.body.collideRight=false;
  this.body.collideLeft= false;
  this.body.immovable=true;
}

movingPlatform.prototype = Object.create(entity.prototype);//inherit from entity

movingPlatform.prototype.update = function(){
  this.movement();
}

movingPlatform.prototype.movement = function(){
  if(this.body.onWall()) {
    this.direction = this.direction*(-1);
  }

  if(this.direction==-1){
    this.body.velocity.x=- this.velocity;
  }
  else if(this.direction==1){
    this.body.velocity.x= this.velocity;
  }
  this.game.world.wrap(this, 0, false, true, false);
}



module.exports = movingPlatform;

},{"../../config.js":31,"../entity.js":24}],22:[function(require,module,exports){
//sacredBow.js
'use strict'

var item = require('./item.js');
var config = require('../../config.js');

function sacredBow(game, x, y, name){
  item.call(this, game, x, y, name);
  this.animations.add('sacredBow', [1], 0, false, 1);
  this.animations.play('sacredBow');
  this.scale.setTo(config.scale2, config.scale2);
}

sacredBow.prototype = Object.create(item.prototype); //inherit from item

sacredBow.prototype.update = function(){

}

//Sets hasSacredBow as true
sacredBow.prototype.effect = function(){
  this.game.hasSacredBow=true;
  this.game.power_up.play();
}


module.exports = sacredBow;

},{"../../config.js":31,"./item.js":18}],23:[function(require,module,exports){
//strengthArrow.js
'use strict'

var item = require('./item.js');
var config = require('../../config.js');

function strengthArrow(game, x, y, name){
  item.call(this, game, x, y, name);
  this.animations.add('strengthArrow', [2], 0, false, 1);
  this.animations.play('strengthArrow');
  this.scale.setTo(config.scale2, config.scale2);
}

strengthArrow.prototype = Object.create(item.prototype); //inherit from item

strengthArrow.prototype.update = function(){

}

//Increases the damage of the arrows
strengthArrow.prototype.effect = function(){
  this.game.bonusDamage++;
  this.game.power_up.play();
}


module.exports = strengthArrow;

},{"../../config.js":31,"./item.js":18}],24:[function(require,module,exports){
//entity.js
'use strict'

var main = require("../main.js");
var Phaser = main.Phaser;

function entity(game, x, y, name){
  Phaser.Sprite.call(this, game, x, y, name);
  game.add.existing(this);
  this.anchor.setTo(0.5, 0.5);
}

entity.prototype = Object.create(Phaser.Sprite.prototype);
entity.prototype.constructor = entity;
entity.prototype.update = function() {}

module.exports = entity;

},{"../main.js":32}],25:[function(require,module,exports){
//hud.js
'use strict'

var HealthBar = require("../Utilities/HealthBar.js");
var config = require("../config.js");

var HUD = {
  myHealthBar: undefined,
  game: undefined,

  create: function(game){
    this.game = game;

    var barConfig = Object.assign({}, config.barConfig);

    barConfig.width = this.game.pitVariables.maxHealth * config.pixelsPerLifePoint;
    barConfig.x = barConfig.x + barConfig.width/2;

    this.myHealthBar = new HealthBar(game, barConfig);
    this.myHealthBar.setFixedToCamera(true);
    this.myHealthBar.setPercent(this.game.pitVariables.health/this.game.pitVariables.maxHealth * 100);
  }
}

module.exports = HUD;

},{"../Utilities/HealthBar.js":30,"../config.js":31}],26:[function(require,module,exports){
//defaultScene.js
'use strict';

/*Every normal level of the game should call these object's methods
passing them its own scope with '.call' or '.apply'. This will
automatically manage entities such as Pit character or the UI, which
are on every level.*/

var pit = require('../Entities/Characters/pit.js');
var shemum = require('../Entities/Enemies/shemum.js');
var reaper = require('../Entities/Enemies/reaper.js');
var config = require('../config.js');
var reapette = require('../Entities/Enemies/reapette.js');
var monoeye = require('../Entities/Enemies/monoeye.js');
var mcgoo = require('../Entities/Enemies/mcgoo.js');
var twinbellows = require('../Entities/Enemies/twinbellows.js');
var nettler = require('../Entities/Enemies/nettler.js');

var HUD = require('../HUD/hud.js');
var chalice = require('../Entities/Scenary/chalice.js');
var bottle = require('../Entities/Scenary/bottle.js');
var barrel = require('../Entities/Scenary/barrel.js');
var strengthArrow = require('../Entities/Scenary/strengthArrow.js');
var angelFeather = require('../Entities/Scenary/angelFeather.js');
var sacredBow = require('../Entities/Scenary/sacredBow.js');
var movingPlatform = require('../Entities/Scenary/movingPlatform.js');

var defaultScene = {
  myPit: undefined,
  map: undefined,
  mapLayer: undefined,
  colisionLayer: undefined,
  platformsLayer: undefined,
  enemiesLayer: undefined,
  itemLayer: undefined,

  preload: function(){

  },

  create: function(){
    //Groups
    this.game.groups= {};
    this.game.groups.enemies = this.game.add.group();
    this.game.groups.arrows = this.game.add.group();
    this.game.groups.projectiles = this.game.add.group();
    this.game.groups.items = this.game.add.group();
    this.game.groups.movingPlatforms = this.game.add.group();

    //Audio
    this.game.underworld = this.game.add.audio('underworld');
    this.game.underworld.loopFull();
    this.game.arrow_shot = this.game.add.audio('arrow_shot');
    this.game.jump = this.game.add.audio('jump');
    this.game.pit_hit = this.game.add.audio('pit_hit');
    this.game.walk = this.game.add.audio('walk');
    this.game.game_over = this.game.add.audio('game_over');
    this.game.reaper_spotted = this.game.add.audio('reaper_spotted');
    this.game.enemy_damage = this.game.add.audio('enemy_damage');
    this.game.enemy_death = this.game.add.audio('enemy_death');
    this.game.get_item = this.game.add.audio('get_item');
    this.game.power_up = this.game.add.audio('power_up');
    this.game.boss_damage = this.game.add.audio('boss_damage');
    this.game.boss_death = this.game.add.audio('boss_death');

    defaultScene.myPit = new pit(this.game, 0, 0, 'pit');

    //Those will be the variables that are kept across all levels
    if (this.game.pitVariables == undefined){
      this.game.pitVariables = {hearts: 0, bottles: 0, maxBottles: 1,
                                bonusDamage: 0, hasSacredBow: false,
                                maxHealth: config.initialPitHealth,
                                health: config.initialPitHealth};
    }

    this.game.hearts = this.game.pitVariables.hearts;
    this.game.bottles = this.game.pitVariables.bottles;
    this.game.maxBottles = this.game.pitVariables.maxBottles;
    this.game.bonusDamage = this.game.pitVariables.bonusDamage;
    this.game.hasSacredBow = this.game.pitVariables.hasSacredBow;

    defaultScene.myPit.health = this.game.pitVariables.health;
    defaultScene.myPit.maxHealth = this.game.pitVariables.maxHealth;

    defaultScene.createTileMap.call(this);
    HUD.create(this.game);

    //Set the rendering order correctly
    this.game.world.bringToTop(this.game.groups.movingPlatforms);
    this.game.world.bringToTop(this.game.groups.arrows);
    this.game.world.bringToTop(this.game.groups.projectiles);
    this.game.world.bringToTop(this.game.groups.items);
    this.game.world.bringToTop(this.game.groups.enemies);
    this.game.world.bringToTop(defaultScene.myPit);


    this.game.groups.movingPlatforms.add(new movingPlatform(this.game, 2000, 14700, 'movingPlatform'));
  },

  update: function(){
    //Tilemap colisions
    this.game.physics.arcade.collide(defaultScene.myPit, defaultScene.platformsLayer);
    this.game.physics.arcade.collide(this.game.groups.enemies, defaultScene.platformsLayer);
    this.game.physics.arcade.collide(this.game.groups.enemies, defaultScene.colisionLayer);
    this.game.physics.arcade.collide(this.game.groups.enemies, this.game.groups.movingPlatforms);
    this.game.physics.arcade.collide(this.game.groups.arrows, defaultScene.colisionLayer, killCollObj);
    this.game.physics.arcade.collide(defaultScene.myPit, defaultScene.colisionLayer);
    this.game.physics.arcade.overlap(this.game.groups.enemies, this.game.groups.arrows, arrowHit);
    this.game.physics.arcade.overlap(defaultScene.myPit, this.game.groups.enemies, passDamage);
    this.game.physics.arcade.overlap(defaultScene.myPit, this.game.groups.projectiles, passDamage);
    this.game.physics.arcade.overlap(defaultScene.myPit, this.game.groups.items, pickUp);
    this.game.physics.arcade.collide(defaultScene.myPit, this.game.groups.movingPlatforms);
    this.game.physics.arcade.collide(this.game.groups.movingPlatforms, defaultScene.colisionLayer);


    function killCollObj(obj, coll){
      obj.kill();
    }

    function arrowHit (enemy, arrow) {
      enemy.receiveDamage(arrow.onHit());

    }

    function passDamage (victim, aggressor){
      victim.damage(aggressor.attackDamage);
    }

    function pickUp (pit, item){
      item.onPickUp();
    }
  },

  shutdown: function(){
    this.game.sound.stopAll();

    if (this.game.newLevel == true){
      defaultScene.savePitVariables.call(this);
      this.game.newLevel = false;
    }

    //Cleans up the memory
    this.game.load.reset();
    this.game.world.removeAll(true);

    defaultScene.myPit = null;
    defaultScene.map = null;
    defaultScene.mapLayer = null;
    defaultScene.colisionLayer = null;
    defaultScene.platformsLayer = null;
    defaultScene.enemiesLayer = null;
    defaultScene.itemLayer = null;
  },

  createTileMap: function(){
    defaultScene.map = this.game.add.tilemap('level');
    defaultScene.map.addTilesetImage('leveltileset');
    defaultScene.map.addTilesetImage('ColisionsTile');
    defaultScene.map.addTilesetImage('EnemiesTileset');

    defaultScene.mapLayer = defaultScene.map.createLayer('Map');
    defaultScene.mapLayer.setScale(config.scale);
    defaultScene.mapLayer.fixedCamera = false;

    defaultScene.edgeLayer = defaultScene.map.createLayer('Edges');
    defaultScene.edgeLayer.setScale(config.scale);
    defaultScene.edgeLayer.visible = false;

    defaultScene.colisionLayer = defaultScene.map.createLayer('Colisions');
    defaultScene.colisionLayer.setScale(config.scale);
    defaultScene.colisionLayer.fixedCamera = false;
    defaultScene.colisionLayer.visible = false;

    defaultScene.platformsLayer = defaultScene.map.createLayer('Platforms');
    defaultScene.platformsLayer.setScale(config.scale);
    defaultScene.platformsLayer.fixedCamera = false;
    defaultScene.platformsLayer.visible = false;

    defaultScene.enemiesLayer = defaultScene.map.createLayer('Enemies');
    defaultScene.enemiesLayer.setScale(config.scale);
    defaultScene.enemiesLayer.fixedCamera = false;
    defaultScene.enemiesLayer.visible = false;

    defaultScene.itemLayer = defaultScene.map.createLayer('Items');
    defaultScene.itemLayer.setScale(config.scale);
    defaultScene.itemLayer.fixedCamera = false;
    defaultScene.itemLayer.visible = false;

    defaultScene.mapLayer.resizeWorld();

    defaultScene.map.setCollision(this.colisionBlockID, true, 'Colisions');
    defaultScene.map.setCollision(this.edgesBlockID, true, 'Edges');
    defaultScene.map.setCollision(this.platformsBlockID, true, 'Platforms');

    //Spawns enemies UNFINISHED
    defaultScene.map.forEach(function (tile){
      var newEnemy = null;
      if (tile.properties != undefined && tile.properties.enemyType != undefined){
        switch (tile.properties.enemyType){
          case "shemum": newEnemy = new shemum(this.game, tile.worldX, tile.worldY, 'enemies', -1); break;
          case "monoeye": newEnemy = new monoeye(this.game, tile.worldX, tile.worldY, 'enemies', defaultScene.myPit); break;
          case "reaper": newEnemy = new reaper(this.game, tile.worldX, tile.worldY, 'enemies', -1, defaultScene.myPit, defaultScene.edgeLayer); break;
          case "mcgoo": newEnemy = new mcgoo(this.game, tile.worldX, tile.worldY, 'enemies', defaultScene.myPit); break;
          case "nettler": newEnemy = new nettler(this.game, tile.worldX, tile.worldY, 'enemies', -1, defaultScene.myPit); break;
          case "twinbellows": newEnemy = new twinbellows(this.game, tile.worldX, tile.worldY, 'twinbellows', defaultScene.myPit); break;
          default: newEnemy = null; break;
        }
      }

      if (newEnemy != null){
        this.game.groups.enemies.add(newEnemy);
      }
    }, this, 0, 0, defaultScene.map.width, defaultScene.map.height, defaultScene.enemiesLayer);

    //Spawns items
    defaultScene.map.forEach(function (tile){
      var newItem = null;
      if (tile.properties != undefined && tile.properties.itemType != undefined){
        switch (tile.properties.itemType){
          case "chalice": newItem = new chalice(this.game, tile.worldX, tile.worldY, 'lifeWater', defaultScene.myPit); break;
          case "bottle": newItem = new bottle(this.game, tile.worldX, tile.worldY, 'lifeWater'); break;
          case "barrel": newItem = new barrel(this.game, tile.worldX, tile.worldY, 'barrel'); break;
          case "strengthArrow": newItem = new strengthArrow(this.game, tile.worldX, tile.worldY, 'powerUps'); break;
          case "angelFeather": newItem = new angelFeather(this.game, tile.worldX, tile.worldY, 'powerUps'); break;
          case "sacredBow": newItem = new sacredBow(this.game, tile.worldX, tile.worldY, 'powerUps'); break;
          default: newItem = null; break;
        }
      }

      if (newItem != null){
        this.game.groups.items.add(newItem);
      }
    }, this, 0, 0, defaultScene.map.width, defaultScene.map.height, defaultScene.itemLayer);

  /*  //Spawns platforms
    defaultScene.map.forEach(function (tile){
      var newMovingPlatform = null;
      if (tile.properties != undefined && tile.properties.movingPlatform != undefined){
          newMovingPlatform = new movingPlatform(this.game, tile.worldX, tile.worldY, 'movingPlatform');
        }

      if (newMovingPlatform != null){
        this.game.groups.movingPlatforms.add(newMovingPlatform);
      }
    }, ;*/

    //Sets platforms specific side collisions
    defaultScene.map.forEach(function (tile){
      tile.collideDown = false;
      tile.collideRight = false;
      tile.collideLeft = false;
    }, this.game, 0, 0, defaultScene.map.width, defaultScene.map.height, defaultScene.platformsLayer);

    //Set the bounds to use only the first map of the tilemap
    this.game.world.setBounds(config.tileSize*config.scale+1, 0,
      this.game.world.bounds.width/2 - (2*config.tileSize*config.scale)-1,
      this.game.world.bounds.height);
      //The ''-1' fixes the vagueness caused by the division/multiplication
  },

  savePitVariables: function(){
    this.game.pitVariables.hearts = this.game.hearts;
    this.game.pitVariables.bottles = this.game.bottles;
    this.game.pitVariables.maxBottles = this.game.maxBottles;
    this.game.pitVariables.bonusDamage = this.game.bonusDamage;
    this.game.pitVariables.hasSacredBow = this.game.hasSacredBow;

    this.game.pitVariables.health = defaultScene.myPit.health;
    this.game.pitVariables.maxHealth = defaultScene.myPit.maxHealth;
  }
};

module.exports = defaultScene;

},{"../Entities/Characters/pit.js":1,"../Entities/Enemies/mcgoo.js":4,"../Entities/Enemies/monoeye.js":5,"../Entities/Enemies/nettler.js":6,"../Entities/Enemies/reaper.js":7,"../Entities/Enemies/reapette.js":8,"../Entities/Enemies/shemum.js":9,"../Entities/Enemies/twinbellows.js":11,"../Entities/Scenary/angelFeather.js":12,"../Entities/Scenary/barrel.js":14,"../Entities/Scenary/bottle.js":15,"../Entities/Scenary/chalice.js":16,"../Entities/Scenary/movingPlatform.js":21,"../Entities/Scenary/sacredBow.js":22,"../Entities/Scenary/strengthArrow.js":23,"../HUD/hud.js":25,"../config.js":31}],27:[function(require,module,exports){
//level1.js
'use strict';

var defaultScene = require('./defaultScene.js');
var pit = require('../Entities/Characters/pit.js');
var config = require('../config.js');
var levelEnd = require('../Entities/Scenary/levelEnd.js');

var level1 = {
  currentLevelEnd: undefined,

  preload: function(){
    this.game.load.image('leveltileset', 'images/scenes/level1tileset.png');
    this.game.load.image('ColisionsTile', 'images/scenes/ColisionsTileset.png');
    this.game.load.image('EnemiesTileset', 'images/scenes/EnemiesTileset.png');
    this.game.load.tilemap('level', 'images/scenes/level1.json', null,
                            Phaser.Tilemap.TILED_JSON);

    this.colisionBlockID = 5761;
    this.edgesBlockID = 5762;
    this.platformsBlockID = 5764;

    defaultScene.preload.call(this);
  },

  create: function(){
    defaultScene.create.call(this);

    this.currentLevelEnd = new levelEnd(this.game, config.level1endLevelPos.x,
                        config.level1endLevelPos.y, 'currentLevelEnd', 'level2');
    this.game.groups.items.add (this.currentLevelEnd);

    defaultScene.myPit.x = config.level1initialPos.x;
    defaultScene.myPit.y = config.level1initialPos.y;

  },

  update: function(){
    defaultScene.update.call(this);
  },

  shutdown: function(){
    //Cleans up the memory
    defaultScene.shutdown.call(this);
  }
};

module.exports = level1;

},{"../Entities/Characters/pit.js":1,"../Entities/Scenary/levelEnd.js":19,"../config.js":31,"./defaultScene.js":26}],28:[function(require,module,exports){
//level1.js
'use strict';

var defaultScene = require('./defaultScene.js');
var pit = require('../Entities/Characters/pit.js');
var config = require('../config.js');
var levelEnd = require('../Entities/Scenary/levelEnd.js');

var level2 = {
  preload: function(){
    this.game.load.image('leveltileset', 'images/scenes/level2tileset.png');
    this.game.load.image('ColisionsTile', 'images/scenes/ColisionsTileset.png');
    this.game.load.image('EnemiesTileset', 'images/scenes/EnemiesTileset.png');
    this.game.load.tilemap('level', 'images/scenes/level2.json', null,
                            Phaser.Tilemap.TILED_JSON);

    this.colisionBlockID = 6721;
    this.edgesBlockID = 6722;
    this.platformsBlockID = 6724;

    defaultScene.preload.call(this);
  },

  create: function(){
    defaultScene.create.call(this);

    defaultScene.myPit.x = config.level2initialPos.x;
    defaultScene.myPit.y = config.level2initialPos.y;

    this.currentLevelEnd = new levelEnd(this.game, config.level2endLevelPos.x,
                        config.level2endLevelPos.y, 'currentLevelEnd', 'level3');
    this.game.groups.items.add (this.currentLevelEnd);
  },

  update: function(){
    defaultScene.update.call(this);
  },

  shutdown: function(){
    //Cleans up the memory
    defaultScene.shutdown.call(this);
  }
};

module.exports = level2;

},{"../Entities/Characters/pit.js":1,"../Entities/Scenary/levelEnd.js":19,"../config.js":31,"./defaultScene.js":26}],29:[function(require,module,exports){
//level3.js
'use strict';

var defaultScene = require('./defaultScene.js');
var pit = require('../Entities/Characters/pit.js');
var config = require('../config.js');

var level3 = {
  preload: function(){
    this.game.load.image('leveltileset', 'images/scenes/level3tileset.png');
    this.game.load.image('ColisionsTile', 'images/scenes/ColisionsTileset.png');
    this.game.load.image('EnemiesTileset', 'images/scenes/EnemiesTileset.png');
    this.game.load.tilemap('level', 'images/scenes/level3.json', null,
                            Phaser.Tilemap.TILED_JSON);

    this.colisionBlockID = 9601;
    this.edgesBlockID = 9602;
    this.platformsBlockID = 9604;

    defaultScene.preload.call(this);
  },

  create: function(){
    defaultScene.create.call(this);

    defaultScene.myPit.x = config.level3initialPos.x;
    defaultScene.myPit.y = config.level3initialPos.y;
  },

  update: function(){
    defaultScene.update.call(this);
  },

  shutdown: function(){
    //Cleans up the memory
    defaultScene.shutdown.call(this);
  }
};

module.exports = level3;

},{"../Entities/Characters/pit.js":1,"../config.js":31,"./defaultScene.js":26}],30:[function(require,module,exports){
/**
  https://github.com/bmarwane/phaser.healthbar

 Copyright (c) 2015 Belahcen Marwane (b.marwane@gmail.com)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

var HealthBar = function(game, providedConfig) {
    this.game = game;

    this.setupConfiguration(providedConfig);
    this.setPosition(this.config.x, this.config.y);
    this.drawBackground();
    this.drawHealthBar();
    this.setFixedToCamera(this.config.isFixedToCamera);
};
HealthBar.prototype.constructor = HealthBar;

HealthBar.prototype.setupConfiguration = function (providedConfig) {
    this.config = this.mergeWithDefaultConfiguration(providedConfig);
    this.flipped = this.config.flipped;
};

HealthBar.prototype.mergeWithDefaultConfiguration = function(newConfig) {
    var defaultConfig= {
        width: 250,
        height: 40,
        x: 0,
        y: 0,
        bg: {
            color: '#651828'
        },
        bar: {
            color: '#FEFF03'
        },
        animationDuration: 200,
        flipped: false,
        isFixedToCamera: false
    };

    return mergeObjetcs(defaultConfig, newConfig);
};

function mergeObjetcs(targetObj, newObj) {
    for (var p in newObj) {
        try {
            targetObj[p] = newObj[p].constructor==Object ? mergeObjetcs(targetObj[p], newObj[p]) : newObj[p];
        } catch(e) {
            targetObj[p] = newObj[p];
        }
    }
    return targetObj;
}

HealthBar.prototype.drawBackground = function() {

    var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
    bmd.ctx.fillStyle = this.config.bg.color;
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.config.width, this.config.height);
    bmd.ctx.fill();
    bmd.update();

    this.bgSprite = this.game.add.sprite(this.x, this.y, bmd);
    this.bgSprite.anchor.set(0.5);

    if(this.flipped){
        this.bgSprite.scale.x = -1;
    }
};

HealthBar.prototype.drawHealthBar = function() {
    var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
    bmd.ctx.fillStyle = this.config.bar.color;
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.config.width, this.config.height);
    bmd.ctx.fill();
    bmd.update();

    this.barSprite = this.game.add.sprite(this.x - this.bgSprite.width/2, this.y, bmd);
    this.barSprite.anchor.y = 0.5;

    if(this.flipped){
        this.barSprite.scale.x = -1;
    }
};

HealthBar.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;

    if(this.bgSprite !== undefined && this.barSprite !== undefined){
        this.bgSprite.position.x = x;
        this.bgSprite.position.y = y;

        this.barSprite.position.x = x - this.config.width/2;
        this.barSprite.position.y = y;
    }
};


HealthBar.prototype.setPercent = function(newValue){
    if(newValue < 0) newValue = 0;
    if(newValue > 100) newValue = 100;

    var newWidth =  (newValue * this.config.width) / 100;

    this.setWidth(newWidth);
};

/*
 Hex format, example #ad3aa3
 */
HealthBar.prototype.setBarColor = function(newColor) {
    var bmd = this.barSprite.key;
    bmd.update();

    var currentRGBColor = bmd.getPixelRGB(0, 0);
    var newRGBColor = hexToRgb(newColor);
    bmd.replaceRGB(currentRGBColor.r,
        currentRGBColor.g,
        currentRGBColor.b,
        255 ,

        newRGBColor.r,
        newRGBColor.g,
        newRGBColor.b,
        255);

};

HealthBar.prototype.setWidth = function(newWidth){
    if(this.flipped) {
        newWidth = -1 * newWidth;
    }
    this.game.add.tween(this.barSprite).to( { width: newWidth }, this.config.animationDuration, Phaser.Easing.Linear.None, true);
};

HealthBar.prototype.setFixedToCamera = function(fixedToCamera) {
    this.bgSprite.fixedToCamera = fixedToCamera;
    this.barSprite.fixedToCamera = fixedToCamera;
};

HealthBar.prototype.kill = function() {
    this.bgSprite.kill();
    this.barSprite.kill();
};

module.exports = HealthBar;



/**
 Utils
 */

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

},{}],31:[function(require,module,exports){
//config.js
'use strict'

var config = {
  //WORLD
  tileSize: 16,
  scale: 3.13,
  scale2: 2.5, //Special scale for some enemies
  maxVelocity: 800, //To avoid tunneling

  //PIT
  initialPitHealth: 40,
  framesBetweenHit: 60,
  jumpTime: 10,
  initialDirection: 1,
  initialState: "normal",

  movementSpeed: 200,

  normalW: 13,
  normalH: 24,
  normalOX: 7, //Normal body X offset
  normalOY: 0,
  crouchW: 13,
  crouchH: 13,
  crouchOX: 1,
  crouchOY: 7,

  shootKey: Phaser.Keyboard.A,
  jumpKey: Phaser.Keyboard.SPACEBAR,

  level1initialPos: {x: 170, y: 8780},
  level2initialPos: {x: 170, y: 500},
  level3initialPos: {x: 170, y: 14800},
  level1endLevelPos: {x: 780, y: 500},
  level2endLevelPos: {x: 780, y: 500},

  //ENEMIES
    //Mcgoo
  mcgooW: 12,
  mcgooH: 20,
  mcgooOX: 5,
  mcgooOY: 0,
  mcgooMaxHealth: 1,
  mcgooHeartValue: 5,
  mcgooAttackDamage: 1,
  mcgooTimeBeetweenAttacks: 100,
  mcgooAimTime: 40,
  mcgooHiddenW: 12,
  mcgooHiddenH: 5,
  mcgooHiddenOX: 5,
  mcgooHiddenOY: 10,
  mcgooDetectionRange: 50,

    //Monoeye
  monoeyeVelocity: 3,
  monoeyeRadius: 300,
  monoeyeW: 20,
  monoeyeH: 20,
  monoeyeOX: 5,
  monoeyeOY: 0,
  monoeyeMaxHealth: 1,
  monoeyeHeartValue: 5,
  monoeyeAttackDamage: 1,

    //Nettler
  nettlerW: 12,
  nettlerH: 12,
  nettlerOX: 8,
  nettlerOY: 8,
  nettlerMaxHealth: 1,
  nettlerVelocity: 75,
  nettlerAttackDamage: 1,
  nettlerHeartValue: 5,
  nettlerCrouchTime: 8,
  nettlerCrouchW: 12,
  nettlerCrouchH: 6,
  nettlerCrouchOX: 8,
  nettlerCrouchOY: 10,
  nettlerRangeDetection: 20,

    //Reaper
  reaperVelocity: 50,
  reaperW: 15,
  reaperH: 24,
  reaperOX: 5,
  reaperOY: -1,
  reaperMaxHealth: 10,
  reaperAttackDamage: 2,
  reaperHeartValue: 10,
  reaperDetectionRange: 20,
  reaperTurnTime: 100,
  reaperTimeToTurn: 300,
  reaperVelocityMultiplier: 3,

    //Reappete
  reapetteVelocity: 3,
  reapetteRadius: 300,
  reapetteW: 10,
  reapetteH: 20,
  reapetteOX: 5,
  reapetteOY: 0,
  reapetteMaxHealth: 1,
  reapetteAttackDamage: 1,
  reapetteHeartValue: 1,

    //Shemum
  shemumVelocity: 150,
  shemumW: 10,
  shemumH: 15,
  shemumOX: 10,
  shemumOY: 4,
  shemumMaxHealth: 1,
  shemumAttackDamage: 1,
  shemumHeartValue: 1,

    //Twin bellows
  twinbellowsW: 30,
  twinbellowsH: 24,
  twinbellowsOX: 0,
  twinbellowsOH: 0,
  twinbellowsMaxHealth: 30,
  twinbellowsAttackDamage: 2,
  twinbellowsVelocity: 70,
  twinbellowsAttackTime: 100,
  twinbellowsJumpTime: 220,
  twinbellowsJumpHeight: -900,
  twinbellowsDirectionTimeRight: 150,
  twinbellowsDirectionTimeLeft: 40,

  //SCENARY
  maxBottles: 8,

    //Arrow
  arrowAttackDamage: 1,
  arrowDistance: 220,
  arrowVelocity: 900,

    //Barrel

    //Bottle

    //Chalice
  chacliceHealing: 7,

    //Heart
  heartTime: 300,

    //Item

    //Level end

    //Magma shot
  magmaShotAttackDamage: 2,
  magmaShotOffset: 10,
  magmaShotDistance: 300,
  magmaShotVelocity: 400,

//moving platforms
  movingPlatformVelocity: 150,

    //HUD VARIABLES
  barConfig: {x: 50, y: 50, width: 10, height: 25,
              bg: {color: '#000074'}, bar: {color: '#e20074'}},
  pixelsPerLifePoint: 15
}

module.exports = config;

},{}],32:[function(require,module,exports){
//main.js
'use strict';

module.exports.Phaser = Phaser;
var level1 = require('./Scenes/level1.js');
var level2 = require('./Scenes/level2.js');
var level3 = require('./Scenes/level3.js');
var BootScene = {
  preload: function () {
    this.game.time.desiredFps = 60;

    this.game.load.spritesheet('pit', 'images/characters/pit.png', 29, 29, 180);
    this.game.load.image('arrow', 'images/scenary/arrow.png');
    this.game.load.image('magmaShot', 'images/scenary/magmaShot.png');
    this.game.load.image('barrel', 'images/scenary/barrel.png');
    this.game.load.spritesheet('enemies', 'images/characters/enemies.png', 30, 30, 195);
    this.game.load.spritesheet('twinbellows', 'images/characters/twinbellows.png', 42, 26, 4);
    this.game.load.spritesheet('heart', 'images/scenary/heart.png', 14, 14, 3);
    this.game.load.spritesheet('lifeWater', 'images/scenary/lifeWater.png', 10, 16, 2);
    this.game.load.spritesheet('powerUps', 'images/scenary/powerUps.png', 8, 16, 3);
    this.game.load.image('movingPlatform', 'images/scenary/movingPlatform.png');
    this.game.load.image('titleScreen', 'images/scenes/title_screen.png');

    this.game.load.audio('underworld', 'audio/music/underworld.mp3');
    this.game.load.audio('game_over', 'audio/music/game_over.mp3');
    this.game.load.audio('reaper_spotted', 'audio/music/reaper_spotted.mp3');
    this.game.load.audio('victory', 'audio/music/victory.mp3');
    this.game.load.audio('arrow_shot', 'audio/sfx/arrow_shot.mp3');
    this.game.load.audio('enemy_damage', 'audio/sfx/enemy_damage.mp3');
    this.game.load.audio('get_item', 'audio/sfx/get_item.mp3');
    this.game.load.audio('jump', 'audio/sfx/jump.mp3');
    this.game.load.audio('pit_hit', 'audio/sfx/pit_hit.mp3');
    this.game.load.audio('reaper_alert', 'audio/sfx/reaper_alert.mp3');
    this.game.load.audio('walk', 'audio/sfx/walk.mp3');
    this.game.load.audio('enemy_death', 'audio/sfx/enemy_death.mp3');
    this.game.load.audio('power_up', 'audio/sfx/power_up.mp3');
    this.game.load.audio('boss_damage', 'audio/sfx/boss_death.mp3');
    this.game.load.audio('boss_damage', 'audio/sfx/boss_damage.mp3');

  },

  create: function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 3500;

    this.game.state.start('play');
  }
};

window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('play', level1);
  game.state.add('level2', level2);
  game.state.add('level3', level3);

  game.state.start('boot');
};

},{"./Scenes/level1.js":27,"./Scenes/level2.js":28,"./Scenes/level3.js":29}]},{},[32]);
