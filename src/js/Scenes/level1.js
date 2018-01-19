//level1.js
'use strict';

var defaultScene = require('./defaultScene.js');
var pit = require('../Entities/Characters/pit.js');
var config = require('../config.js');

var level1 = {
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

    this.game.hearts=0;
    this.game.bottles=0;
    this.game.maxBottles=1;
    this.game.bonusDamage=0;
    this.game.hasSacredBow=false;

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
