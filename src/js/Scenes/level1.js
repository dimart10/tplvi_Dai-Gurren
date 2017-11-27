//level1.js

var defaultScene = require('./defaultScene.js');
var pit = require('../Entities/Characters/pit.js');
var terrain = require('../Entities/Scenary/terrain.js');
var background = require('../Entities/Scenary/background.js');

var level1 = {
  level1Background: undefined,
  myPit: undefined,
  map: undefined,
  layer: undefined,

  preload: function(){
    defaultScene.preload.call(this);
    this.game.load.image('level1', '../../images/scenes/level1.png');
    this.game.load.tilemap('level1map', '../../images/scenes/level1.json', null, Phaser.Tilemap.TILED_JSON);
  },

  create: function(){
    defaultScene.create.call(this);
    this.map = this.game.add.tilemap('level1map');
    this.map.addTilesetImage('Map sprites', 'level1');
    this.layer = this.map.createLayer('level1layer');
    this.layer.resizeWorld();
    //this.level1Background = new background(this.game, 0, -8280, 'level1');
    //defaultScene.entities.push(this.level1Background);

    this.myPit = new pit(this.game, 100, 480, 'pit');
    defaultScene.entities.push(this.myPit);
  },

  update: function(){
    defaultScene.update.call(this);
  }
};

module.exports = level1;
