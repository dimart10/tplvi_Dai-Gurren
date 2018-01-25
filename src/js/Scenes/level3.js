//level3.js
'use strict';

var defaultScene = require('./defaultScene.js');
var pit = require('../Entities/Characters/pit.js');
var config = require('../config.js');
var levelEnd = require('../Entities/Scenary/levelEnd.js');

var level3 = {
  preload: function(){
    this.game.load.image('leveltileset', 'images/scenes/level3tileset.png');
    this.game.load.image('ColisionsTile', 'images/scenes/ColisionsTileset.png');
    this.game.load.image('EnemiesTileset', 'images/scenes/EnemiesTileset.png');
    this.game.load.tilemap('level', 'images/scenes/level3.json', null,
                            Phaser.Tilemap.TILED_JSON);

    this.colisionBlockID = config.level3colisionBlockID;
    this.edgesBlockID = config.level3edgesBlockID;
    this.platformsBlockID = config.level3platformsBlockID;
    this.hazardBlockID = config.level3hazardBlockID;

    defaultScene.preload.call(this);
  },

  create: function(){
    defaultScene.create.call(this);

    defaultScene.myPit.x = config.level3initialPos.x;
    defaultScene.myPit.y = config.level3initialPos.y;

    this.currentLevelEnd = new levelEnd(this.game, config.level3endLevelPos.x,
                        config.level3endLevelPos.y, 'currentLevelEnd', 'bossLevel');
    this.game.groups.items.add (this.currentLevelEnd);
    
    this.game.sound.stopAll();
    this.game.underworld.loopFull();
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
