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

    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('level1tileset');
    this.map.addTilesetImage('ColisionsTile');

    this.mapLayer = this.map.createLayer('Map');
    this.mapLayer.scale.set(3.12);
    this.mapLayer.fixedCamera = false;

    this.colisionLayer = this.map.createLayer('Colisions');
    this.colisionLayer.scale.set(3.12);
    this.colisionLayer.fixedCamera = false;

    this.mapLayer.resizeWorld();

    this.myPit = new pit(this.game, 100, 400, 'pit');
    defaultScene.entities.push(this.myPit);
  },

  update: function(){
    defaultScene.update.call(this);
  }
};

module.exports = level1;
