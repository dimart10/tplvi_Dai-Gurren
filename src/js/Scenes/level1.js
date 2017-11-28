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
