(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//pit.js
'use strict'

var entity = require('../entity.js');
var arrow = require('../Scenary/arrow.js');
var config = require('../../config.js');

function pit(game, x, y, name){
  entity.call(this, game, x, y, name);
  this.game = game;

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
      nArrow = new arrow(this.game, this.position.x, this.position.y, "arrow", this.direction);
      this.arrowtimer=0;
    }
}

module.exports = pit;

},{"../../config.js":11,"../Scenary/arrow.js":7,"../entity.js":8}],2:[function(require,module,exports){
//flying.js
'use strict';

var entity = require('../entity.js');

function flying(game, x, y, name, player){
  entity.call(this, game, x, y, name);
  this.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = false;
  this.body.allowGravity= false;
  this.goalX;
  this.goalY;
  this.velocity;
  this.radius;
  this.rotateangle =0;
}

flying.prototype = Object.create(entity.prototype);//inherit from entity

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

},{"../entity.js":8}],3:[function(require,module,exports){
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

},{"./reapette.js":4,"./terrestrial.js":6}],4:[function(require,module,exports){
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


  this.animations.add('right', [75], 0, false);
  this.animations.add('left', [74], 0, false);
  if(this.x>this.player.x) this.animations.play('left');
  else if(this.x<this.player.x) this.animations.play('right');
}

reapette.prototype = Object.create(flying.prototype);

reapette.prototype.update = function(){
  this.swoop();
}

module.exports = reapette;

},{"./flying.js":2}],5:[function(require,module,exports){
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

},{"./terrestrial.js":6}],6:[function(require,module,exports){
//terrestrial.js
'use strict';

var entity = require('../entity.js');

function terrestrial(game, x, y, name){
  entity.call(this, game, x, y, name);
  this.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = false;
  this.body.maxVelocity.y = 800;
}

terrestrial.prototype = Object.create(entity.prototype);//inherit from entity

//Moves toroidally either right or left depeneding on the direction given at
//given the velocity
terrestrial.prototype.horizMove = function(velocity, direction){
  if(this.direction==-1){
    this.body.velocity.x=- velocity;
  }
  else if(this.direction==1){
    this.body.velocity.x= velocity;
  }
  this.game.world.wrap(this, 0, false, true, false);
}

module.exports = terrestrial;

},{"../entity.js":8}],7:[function(require,module,exports){
//arrow.js
'use strict'

var entity = require('../entity.js');

function arrow(game, x, y, name, direction){
  this.direction = direction;
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

  this.maximumDistance = 220;

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

arrow.prototype.move = function(){
  if (this.direction == 1) this.body.velocity.x = 900;
  else if(this.direction==-1) this.body.velocity.x = -900;
  else if(this.direction==0) this.body.velocity.y = -900;
  else if (this.direction==2) this.body.velocity.y = 900;
}

arrow.prototype.cycleOfLife = function(){
  var currentPosition;
  if (this.direction == 1 || this.direction == -1){
    currentPosition = this.x;
  } else{
    currentPosition = this.y;
  }
  if (Math.abs(currentPosition - this.initialPosition) >= this.maximumDistance)
    this.kill();

  if(this.counter > 75) this.kill();
}

module.exports = arrow;

},{"../entity.js":8}],8:[function(require,module,exports){
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

},{"../main.js":12}],9:[function(require,module,exports){
//defaultScene.js
'use strict';

/*Every normal level of the game should call these object's methods
passing them its own scope with '.call' or '.apply'. This will
automatically manage entities such as Pit character or the UI, which
are on every level.*/

var defaultScene = {
  myPit: undefined,
  entities: [],

  preload: function(){
    this.game.time.desiredFps = 60;
    this.game.load.spritesheet('pit', '../../images/characters/pit.png', 29, 29, 180);
    this.game.load.image('arrow', '../../images/scenary/arrow(bigger).png');
    this.game.load.spritesheet('enemies', '../../images/characters/enemies.png', 30, 30, 150)
  },

  create: function(){
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 3500;
  },

  update: function(){
    for (var i = 0; i < defaultScene.entities.length; i++){
      defaultScene.entities[i].update();
    }
  }
};

module.exports = defaultScene;

},{}],10:[function(require,module,exports){
//level1.js
'use strict';

var defaultScene = require('./defaultScene.js');
var pit = require('../Entities/Characters/pit.js');
var shemum = require('../Entities/Enemies/shemum.js');
var reaper = require('../Entities/Enemies/reaper.js');
var config = require('../config.js');
var reapette = require('../Entities/Enemies/reapette.js');

var level1 = {
  myPit: undefined,
  map: undefined,
  mapLayer: undefined,
  colisionLayer: undefined,

  preload: function(){
    defaultScene.preload.call(this);
    this.game.load.image('level1tileset', '../../images/scenes/level1tileset.png');
    this.game.load.image('ColisionsTile', '../../images/scenes/colisions.png');
    this.game.load.tilemap('level1', '../../images/scenes/level1.json', null,
                            Phaser.Tilemap.TILED_JSON);
  },

  create: function(){
    defaultScene.create.call(this);

    this.createTileMap();

    this.myPit = new pit(this.game, 170, 8735, 'pit');
    this.myShemum = new shemum(this.game, 180, 8735, 'enemies', -1);
    this.myReaper = new reaper(this.game, 300, 8535, 'enemies', -1, this.myPit);
    this.myReapette = new reapette(this.game, 100, 8500, 'enemies', this.myPit);
    defaultScene.entities.push(this.myPit);
  },

  update: function(){
    defaultScene.update.call(this);

    //Tilemap colisions
    this.game.physics.arcade.collide(this.myPit, this.colisionLayer);
    this.game.physics.arcade.collide(this.myShemum, this.colisionLayer);
    this.game.physics.arcade.collide(this.myReaper, this.colisionLayer);
    this.game.physics.arcade.collide(this.myReaper, this.edgeLayer);

    //Pit debugging
    this.game.debug.body(this.myShemum);
    this.game.debug.body(this.myPit);
    this.game.debug.body(this.myReaper);
    this.game.debug.body(this.myReapette);
  },

  createTileMap: function(){
    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('level1tileset');
    this.map.addTilesetImage('ColisionsTile');

    this.mapLayer = this.map.createLayer('Map');
    this.mapLayer.setScale(config.scale);
    this.mapLayer.fixedCamera = false;

    this.edgeLayer = this.map.createLayer('Edges');
    this.edgeLayer.setScale(config.scale);
    this.edgeLayer.visible = false;
    this.map.setCollision(5762, true, 'Edges');

    this.colisionLayer = this.map.createLayer('Colisions');
    this.colisionLayer.setScale(config.scale);
    this.colisionLayer.fixedCamera = false;
    this.colisionLayer.visible = false;

    this.mapLayer.resizeWorld();

    this.map.setCollision(5761, true, 'Colisions');

    //Set the bounds to use only the first map of the tilemap
    this.game.world.setBounds(config.tileSize*config.scale, 0,
      this.game.world.bounds.width/2 - (2*config.tileSize*config.scale)-1,
      this.game.world.bounds.height);
      //The ''-1' fixes the vagueness caused by the division/multiplication
  }
};

module.exports = level1;

},{"../Entities/Characters/pit.js":1,"../Entities/Enemies/reaper.js":3,"../Entities/Enemies/reapette.js":4,"../Entities/Enemies/shemum.js":5,"../config.js":11,"./defaultScene.js":9}],11:[function(require,module,exports){
//config.js
'use strict'

var config = {
  tileSize: 16,
  scale: 3.13
}

module.exports = config;

},{}],12:[function(require,module,exports){
'use strict';

module.exports.Phaser = Phaser;
var level1 = require('./Scenes/level1.js');

var BootScene = {
  preload: function () {

  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {

  },

  create: function () {
    this.game.state.start('play');
  }
};

window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
  
  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', level1);

  game.state.start('boot');
};

},{"./Scenes/level1.js":10}]},{},[12]);
