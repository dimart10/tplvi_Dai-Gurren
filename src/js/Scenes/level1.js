//level1.js
'use strict';

var defaultScene = require('./defaultScene.js');
var pit = require('../Entities/Characters/pit.js');
var shemum = require('../Entities/Enemies/shemum.js');
var reaper = require('../Entities/Enemies/reaper.js');
var config = require('../config.js');
var reapette = require('../Entities/Enemies/reapette.js');
var monoeye = require('../Entities/Enemies/monoeye.js');

var level1 = {
  myPit: undefined,
  map: undefined,
  mapLayer: undefined,
  colisionLayer: undefined,

  preload: function(){
    defaultScene.preload.call(this);

    this.game.load.image('level1tileset', 'images/scenes/level1tileset.png');
    this.game.load.image('ColisionsTile', 'images/scenes/colisions.png');
    this.game.load.tilemap('level1', 'images/scenes/level1.json', null,
                            Phaser.Tilemap.TILED_JSON);
  },

  create: function(){
    defaultScene.create.call(this);

    this.createTileMap();

    this.groups= {};
    this.groups.enemies = this.game.add.group();
    this.groups.arrows = this.game.add.group();

    this.myPit = new pit(this.game, 170, 8735, 'pit', this.groups);
    this.groups.enemies.add(new shemum(this.game, 180, 8735, 'enemies', -1));
    this.myReaper=new reaper(this.game, 300, 8535, 'enemies', -1, this.myPit, this.groups);
    this.groups.enemies.add(this.myReaper);
    this.groups.enemies.add(new monoeye(this.game, 150, 8500, 'enemies', this.myPit));
    defaultScene.entities.push(this.myPit);

  },

  update: function(){
      defaultScene.update.call(this);

      //Tilemap colisions

      this.game.physics.arcade.collide(this.groups.enemies, this.colisionLayer);
      this.game.physics.arcade.collide(this.groups.arrows, this.colisionLayer, killCollObj);
      this.game.physics.arcade.collide(this.myPit, this.colisionLayer);
      this.game.physics.arcade.collide(this.myReaper, this.edgeLayer);
      this.game.physics.arcade.overlap(this.groups.enemies, this.groups.arrows, passDamage);

      //Pit debugging
      this.game.debug.body(this.myPit);

      function killCollObj(obj, coll){
        obj.kill();
      }

      function passDamage (enemy, arrow) {
      enemy.receiveDamage(arrow);
      arrow.kill();
    }
    },
  createTileMap: function(){
    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('level1tileset');
    this.map.addTilesetImage('ColisionsTile');

    this.mapLayer = this.map.createLayer('Map');
    this.mapLayer.setScale(config.scale);
    this.mapLayer.fixedCamera = false;

    this.edgeLayer = this.map.createLayer('Edges');
    this.edgeLayer.setScale(config.scale);
    this.edgeLayer.visible = false;
    this.map.setCollision(5762, true, 'Edges');

    this.colisionLayer = this.map.createLayer('Colisions');
    this.colisionLayer.setScale(config.scale);
    this.colisionLayer.fixedCamera = false;
    this.colisionLayer.visible = false;

    this.mapLayer.resizeWorld();

    this.map.setCollision(5761, true, 'Colisions');

    //Set the bounds to use only the first map of the tilemap
    this.game.world.setBounds(config.tileSize*config.scale, 0,
      this.game.world.bounds.width/2 - (2*config.tileSize*config.scale)-1,
      this.game.world.bounds.height);
      //The ''-1' fixes the vagueness caused by the division/multiplication
  }
};

module.exports = level1;
