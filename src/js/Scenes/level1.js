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

    this.colisionBlockID = config.level1colisionBlockID;
    this.edgesBlockID = config.level1edgesBlockID;
    this.platformsBlockID = config.level1platformsBlockID;
    this.hazardBlockID = config.level1hazardBlockID;

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
