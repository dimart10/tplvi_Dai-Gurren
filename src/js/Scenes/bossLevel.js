//bossLevel.js
'use strict';

var defaultScene = require('./defaultScene.js');
var pit = require('../Entities/Characters/pit.js');
var config = require('../config.js');

var bossLevel = {
  preload: function(){
    this.game.load.image('leveltileset', 'images/scenes/bossleveltileset.png');
    this.game.load.image('ColisionsTile', 'images/scenes/ColisionsTileset.png');
    this.game.load.image('EnemiesTileset', 'images/scenes/EnemiesTileset.png');
    this.game.load.tilemap('level', 'images/scenes/bossLevel.json', null,
                            Phaser.Tilemap.TILED_JSON);

    this.colisionBlockID = config.bossLevelcolisionBlockID;
    this.platformsBlockID = config.bossLevelplatformsBlockID;

    defaultScene.preload.call(this);


  },

  create: function(){
    defaultScene.create.call(this);
    defaultScene.myPit.x = config.bossLevelinitialPos.x;
    defaultScene.myPit.y = config.bossLevelinitialPos.y;
    this.game.sound.stopAll();
    this.game.boss_theme.loopFull();
  },

  update: function(){
    defaultScene.update.call(this);
  },

  shutdown: function(){
    //Cleans up the memory
    defaultScene.shutdown.call(this);
  }
};

module.exports = bossLevel;
