//level1.js
'use strict';

var defaultScene = require('./defaultScene.js');
var pit = require('../Entities/Characters/pit.js');
var shemum = require('../Entities/Enemies/shemum.js');
var reaper = require('../Entities/Enemies/reaper.js');
var config = require('../config.js');
var reapette = require('../Entities/Enemies/reapette.js');
var monoeye = require('../Entities/Enemies/monoeye.js');
var mcgoo = require('../Entities/Enemies/mcgoo.js');
var twinbellows = require('../Entities/Enemies/twinbellows.js');
var nettler = require('../Entities/Enemies/nettler.js');
var HUD = require("../HUD/hud.js");

var level1 = {
  myPit: undefined,
  map: undefined,
  mapLayer: undefined,
  colisionLayer: undefined,
  platformsLayer: undefined,
  enemiesLayer: undefined,

  preload: function(){
    defaultScene.preload.call(this);

    this.game.load.image('level1tileset', 'images/scenes/level1tileset.png');
    this.game.load.image('ColisionsTile', 'images/scenes/ColisionsTileset.png');
    this.game.load.image('EnemiesTileset', 'images/scenes/EnemiesTileset.png');
    this.game.load.tilemap('level1', 'images/scenes/level1.json', null,
                            Phaser.Tilemap.TILED_JSON);
  },

  create: function(){
    defaultScene.create.call(this);

    this.game.groups= {};
    this.game.groups.enemies = this.game.add.group();
    this.game.groups.arrows = this.game.add.group();
    this.game.groups.projectiles = this.game.add.group();
    this.game.groups.items = this.game.add.group();
    this.game.underworld = this.game.add.audio('underworld');
    this.game.underworld.loopFull();
    this.game.arrow_shot = this.game.add.audio('arrow_shot');
    this.game.jump = this.game.add.audio('jump');
    this.game.pit_hit = this.game.add.audio('pit_hit');
    this.game.walk = this.game.add.audio('walk');
    this.game.game_over = this.game.add.audio('game_over');
    this.game.reaper_spotted = this.game.add.audio('reaper_spotted');
    this.game.enemy_damage = this.game.add.audio('enemy_damage');
    this.game.enemy_death = this.game.add.audio('enemy_death');
    this.game.get_item = this.game.add.audio('get_item');

        this.myPit = new pit(this.game, config.level1initialPos.x,
                              config.level1initialPos.y, 'pit');

    this.createTileMap();
    HUD.create(this.game);

    //Set the rendering order correctly
    this.game.world.bringToTop(this.game.groups.arrows);
    this.game.world.bringToTop(this.game.groups.projectiles);
    this.game.world.bringToTop(this.game.groups.items);
    this.game.world.bringToTop(this.game.groups.enemies);
    this.game.world.bringToTop(this.myPit);
  },

  update: function(){
    defaultScene.update.call(this);

    //Tilemap colisions
    this.game.physics.arcade.collide(this.myPit, this.platformsLayer);
    this.game.physics.arcade.collide(this.game.groups.enemies, this.colisionLayer);
    this.game.physics.arcade.collide(this.game.groups.arrows, this.colisionLayer, killCollObj);
    this.game.physics.arcade.collide(this.myPit, this.colisionLayer);
    this.game.physics.arcade.overlap(this.game.groups.enemies, this.game.groups.arrows, arrowHit);
    this.game.physics.arcade.overlap(this.myPit, this.game.groups.enemies, passDamage);
    this.game.physics.arcade.overlap(this.myPit, this.game.groups.projectiles, passDamage);
    this.game.physics.arcade.overlap(this.myPit, this.game.groups.items, pickUp);


    function killCollObj(obj, coll){
      obj.kill();
    }

    function arrowHit (enemy, arrow) {
      enemy.receiveDamage(arrow.attackDamage);
      arrow.kill();
    }

    function passDamage (victim, aggressor){
      victim.damage(aggressor.attackDamage);
    }

    function pickUp (pit, item){
      item.onPickUp();
    }
  },

  shutdown: function(){
    //Cleans up the memory

    defaultScene.shutdown.call(this);

    this.myPit = null;
    this.map = null;
    this.mapLayer = null;
    this.colisionLayer = null;
    this.platformsLayer = null;
    this.enemiesLayer = null;
  },

  createTileMap: function(){
    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('level1tileset');
    this.map.addTilesetImage('ColisionsTile');
    this.map.addTilesetImage('EnemiesTileset');

    this.mapLayer = this.map.createLayer('Map');
    this.mapLayer.setScale(config.scale);
    this.mapLayer.fixedCamera = false;

    this.edgeLayer = this.map.createLayer('Edges');
    this.edgeLayer.setScale(config.scale);
    this.edgeLayer.visible = false;

    this.colisionLayer = this.map.createLayer('Colisions');
    this.colisionLayer.setScale(config.scale);
    this.colisionLayer.fixedCamera = false;
    this.colisionLayer.visible = false;

    this.platformsLayer = this.map.createLayer('Platforms');
    this.platformsLayer.setScale(config.scale);
    this.platformsLayer.fixedCamera = false;
    this.platformsLayer.visible = false;

    this.enemiesLayer = this.map.createLayer('Enemies');
    this.enemiesLayer.setScale(config.scale);
    this.enemiesLayer.fixedCamera = false;
    this.enemiesLayer.visible = false;

    this.mapLayer.resizeWorld();

    this.map.setCollision(5761, true, 'Colisions');
    this.map.setCollision(5762, true, 'Edges');
    this.map.setCollision(5764, true, 'Platforms');

    //Spawns enemies UNFINISHED
    this.map.forEach(function (tile){
      var newEnemy = null;
      if (tile.properties != undefined && tile.properties.enemyType != undefined){
        switch (tile.properties.enemyType){
          case "shemum": newEnemy = new shemum(this.game, tile.worldX, tile.worldY, 'enemies', -1); break;
          case "monoeye": newEnemy = new monoeye(this.game, tile.worldX, tile.worldY, 'enemies', this.myPit); break;
          case "reaper": newEnemy = new reaper(this.game, tile.worldX, tile.worldY, 'enemies', -1, this.myPit, this.edgeLayer); break;
          case "mcgoo": newEnemy = new mcgoo(this.game, tile.worldX, tile.worldY, 'enemies', this.myPit); break;
          case "nettler": newEnemy = new nettler(this.game, tile.worldX, tile.worldY, 'enemies', -1, this.myPit); break;
          case "twinbellows": newEnemy = new twinbellows(this.game, tile.worldX, tile.worldY, 'twinbellows', this.myPit); break;
          default: newEnemy = null; break;
        }
      }

      if (newEnemy != null){
        this.game.groups.enemies.add(newEnemy);
      }
    }, this, 0, 0, this.map.width, this.map.height, this.enemiesLayer);

    //Sets platforms specific side collisions
    this.map.forEach(function (tile){
      tile.collideDown = false;
      tile.collideRight = false;
      tile.collideLeft = false;
    }, this.game, 0, 0, this.map.width, this.map.height, this.platformsLayer);

    //Set the bounds to use only the first map of the tilemap
    this.game.world.setBounds(config.tileSize*config.scale+1, 0,
      this.game.world.bounds.width/2 - (2*config.tileSize*config.scale)-1,
      this.game.world.bounds.height);
      //The ''-1' fixes the vagueness caused by the division/multiplication
  }
};

module.exports = level1;
