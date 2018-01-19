//level1.js
'use strict';

var defaultScene = require('./defaultScene.js');
var pit = require('../Entities/Characters/pit.js');
var config = require('../config.js');

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