(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//pit.js
var entity = require('../entity.js');

function pit(game, x, y, name){
  entity.call(this, game, x, y, name);
  game.camera.follow(this);

  this.scale.setTo(3.12, 3.12);
  game.physics.p2.enable(this);
  this.body.fixedRotation = true;

  this.body.clearShapes();
  this.body.addRectangle(25, 64);

  this.newAnimation('stillRight', [7], 0, false, true);
  this.newAnimation('stillLeft', [6], 0, false, false);
  this.newAnimation('walkRight', [10, 9, 8, 7], 15, true, false);
  this.newAnimation('walkLeft', [3, 4, 5, 6], 15, true, false);


  this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.cursors = game.input.keyboard.createCursorKeys(); //TESTING

  //PROVISIONAL
  this.game = game;
  this.jumptimer=0;
}

pit.prototype = Object.create(entity.prototype); //Inherits from entity

pit.prototype.newAnimation = function (name, frames, fps, repeat, playOnCreate){
  this.animations.add(name, frames, fps, repeat);
  if (playOnCreate) this.animations.play(name);
}

pit.prototype.update = function(){
  this.move();
  this.jump();
}

pit.prototype.move = function(){ //TESTING
  if (this.cursors.left.isDown) {
  		    this.body.moveLeft(150);
          this.animations.play("walkLeft");
      }
      else if (this.cursors.right.isDown)
      {
  		    this.body.moveRight(150);
          this.animations.play("walkRight");
      }
      else{
        this.body.velocity.x = 0;
        if (this.animations.name == "walkRight") this.animations.play("stillRight");
        else if (this.animations.name == "walkLeft") this.animations.play("stillLeft");
      }
}


pit.prototype.jump = function(){

  if(this.spacebar.isDown && this.checkIfCanJump()) {
    this.jumptimer=1;
    this.body.velocity.y = -150;
  }

  else if(this.spacebar.isDown && (this.jumptimer!=0))  {
      if(this.jumptimer > 40){
        this.jumptimer=0;
      }
      else{
        this.jumptimer++;
        this.body.velocity.y=-150;
      }
    }

  else if (this.jumptimer != 0){
    this.jumptimer=0;
  }
}







//Method that checks if the player is touching the ground
pit.prototype.checkIfCanJump = function() {
  var c, d, i, result, yAxis;
  yAxis = p2.vec2.fromValues(0, 1);
  result = false; //returned variable, initialized as false
  //Loop that iterates through the collisions in the game
  for (i=0; i < this.game.physics.p2.world.narrowphase.contactEquations.length; i++ ) {
    //Variable c contains the collisions in the i position of the vector
    c = this.game.physics.p2.world.narrowphase.contactEquations[i];
    //If a collisions includes this.body as either of the bodies colliding
    if (c.bodyA === this.body.data || c.bodyB === this.body.data) {
      //D is assigned a position to check if this.body is above or below
      //the other body (this comment needs more work)
      d = p2.vec2.dot(c.normalA, yAxis);
      if (c.bodyA === this.body.data) {
        d *= -1;
      }
      if (d > 0.5) {
        result = true;
      }
    }
  }
  return result;
}

module.exports = pit;

},{"../entity.js":4}],2:[function(require,module,exports){
//background.js
'use strict'

var entity = require('../entity.js');

function background(game, x, y, name){
  entity.call(this, game, x, y, name);
  this.scale.setTo(3.12, 3.12);
}

background.prototype = Object.create(entity.prototype);

module.exports = background;

},{"../entity.js":4}],3:[function(require,module,exports){
//terrain.js
'use strict'

var entity = require('../entity.js');

function terrain(game, x, y, name){
  entity.call(this, game, x, y, name);
  this.scale.setTo(0.1, 0.1);
  game.physics.p2.enable(this);
  this.body.static = true;
  this.body.data.gravityScale = 0;
}

terrain.prototype = Object.create(entity.prototype);

module.exports = terrain;

},{"../entity.js":4}],4:[function(require,module,exports){
//entity.js
'use strict'

var main = require("../main.js");
var Phaser = main.Phaser;

function entity(game, x, y, name){
  Phaser.Sprite.call(this, game, x, y, name);
  game.add.existing(this);
  this.anchor.setTo(0, 0);
}

entity.prototype = Object.create(Phaser.Sprite.prototype);
entity.prototype.constructor = entity;
entity.prototype.update = function() {}

module.exports = entity;

},{"../main.js":7}],5:[function(require,module,exports){
//defaultScene.js

/*Every normal level of the game should call these object's methods
passing them its own scope with '.call' or '.apply'. This will
automatically manage entities such as Pit character or the UI, which
are on every level.*/

var defaultScene = {
  myPit: undefined,
  entities: [],

  preload: function(){
    this.game.load.spritesheet('pit', '../../images/characters/pit.png', 29, 29, 180);
    this.game.load.image('box', '../../images/scenary/box.png');
  },

  create: function(){
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.gravity.y = 150;
  },

  update: function(){
    for (var i = 0; i < defaultScene.entities.length; i++){
      defaultScene.entities[i].update();
    }
  }
};

module.exports = defaultScene;

},{}],6:[function(require,module,exports){
//level1.js

var defaultScene = require('./defaultScene.js');
var pit = require('../Entities/Characters/pit.js');
var terrain = require('../Entities/Scenary/terrain.js');
var background = require('../Entities/Scenary/background.js');

var level1 = {
  level1Background: undefined,
  myPit: undefined,
  map: undefined,
  mapLayer: undefined,
  colisionLayer: undefined,

  preload: function(){
    defaultScene.preload.call(this);
    this.game.load.image('level1tileset', '../../images/scenes/level1tileset.png');
    this.game.load.image('ColisionsTile', '../../images/scenes/colisions.png');
    this.game.load.tilemap('level1', '../../images/scenes/level1.json', null, Phaser.Tilemap.TILED_JSON);
  },

  create: function(){
    defaultScene.create.call(this);
this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('level1tileset');
    this.map.addTilesetImage('ColisionsTile');

    this.mapLayer = this.map.createLayer('Map');
    this.mapLayer.setScale(3.12);
    this.mapLayer.fixedCamera = false;

    this.colisionLayer = this.map.createLayer('Colisions');
    this.colisionLayer.setScale(3.12);
    this.colisionLayer.fixedCamera = false;
    this.colisionLayer.visible = false;

    this.mapLayer.resizeWorld();

    this.map.setCollision(5761, true, 'Colisions');
    this.game.physics.p2.convertTilemap(this.map, 'Colisions');

    this.myPit = new pit(this.game, 100, 400, 'pit');
    defaultScene.entities.push(this.myPit);
  },

  update: function(){
    defaultScene.update.call(this);
    this.myPit.body.debug = true; //TESTING
  }
};

module.exports = level1;

},{"../Entities/Characters/pit.js":1,"../Entities/Scenary/background.js":2,"../Entities/Scenary/terrain.js":3,"./defaultScene.js":5}],7:[function(require,module,exports){
'use strict';

module.exports.Phaser = Phaser;
var level1 = require('./Scenes/level1.js');

var BootScene = {
  preload: function () {
    this.game.load.baseURL = 'https://dimart10.github.io/tplvi_Dai-Gurren/src';
    this.game.load.crossOrigin = 'anonymous';
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    //this.game.load.image('logo', 'images/phaser.png');
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

},{"./Scenes/level1.js":6}]},{},[7]);
