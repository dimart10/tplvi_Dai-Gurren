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
