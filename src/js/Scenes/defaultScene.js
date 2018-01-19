//defaultScene.js
'use strict';

/*Every normal level of the game should call these object's methods
passing them its own scope with '.call' or '.apply'. This will
automatically manage entities such as Pit character or the UI, which
are on every level.*/

var pit = require('../Entities/Characters/pit.js');
var shemum = require('../Entities/Enemies/shemum.js');
var reaper = require('../Entities/Enemies/reaper.js');
var config = require('../config.js');
var reapette = require('../Entities/Enemies/reapette.js');
var monoeye = require('../Entities/Enemies/monoeye.js');
var mcgoo = require('../Entities/Enemies/mcgoo.js');
var twinbellows = require('../Entities/Enemies/twinbellows.js');
var nettler = require('../Entities/Enemies/nettler.js');

var HUD = require('../HUD/hud.js');
var chalice = require('../Entities/Scenary/chalice.js');
var bottle = require('../Entities/Scenary/bottle.js');
var barrel = require('../Entities/Scenary/barrel.js');
var strengthArrow = require('../Entities/Scenary/strengthArrow.js');
var angelFeather = require('../Entities/Scenary/angelFeather.js');
var sacredBow = require('../Entities/Scenary/sacredBow.js');
var movingPlatform = require('../Entities/Scenary/movingPlatform.js');

var defaultScene = {
  myPit: undefined,
  map: undefined,
  mapLayer: undefined,
  colisionLayer: undefined,
  platformsLayer: undefined,
  enemiesLayer: undefined,
  itemLayer: undefined,

  preload: function(){

  },

  create: function(){
    //Groups
    this.game.groups= {};
    this.game.groups.enemies = this.game.add.group();
    this.game.groups.arrows = this.game.add.group();
    this.game.groups.projectiles = this.game.add.group();
    this.game.groups.items = this.game.add.group();
    this.game.groups.movingPlatforms = this.game.add.group();

    //Audio
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
    this.game.power_up = this.game.add.audio('power_up');
    this.game.boss_damage = this.game.add.audio('boss_damage');
    this.game.boss_death = this.game.add.audio('boss_death');

    defaultScene.myPit = new pit(this.game, 0, 0, 'pit');

    //Those will be the variables that are kept across all levels
    if (this.game.pitVariables == undefined){
      this.game.pitVariables = {hearts: 0, bottles: 0, maxBottles: 1,
                                bonusDamage: 0, hasSacredBow: false,
                                maxHealth: config.initialPitHealth,
                                health: config.initialPitHealth};
    }

    this.game.hearts = this.game.pitVariables.hearts;
    this.game.bottles = this.game.pitVariables.bottles;
    this.game.maxBottles = this.game.pitVariables.maxBottles;
    this.game.bonusDamage = this.game.pitVariables.bonusDamage;
    this.game.hasSacredBow = this.game.pitVariables.hasSacredBow;

    defaultScene.myPit.health = this.game.pitVariables.health;
    defaultScene.myPit.maxHealth = this.game.pitVariables.maxHealth;

    defaultScene.createTileMap.call(this);
    HUD.create(this.game);

    //Set the rendering order correctly
    this.game.world.bringToTop(this.game.groups.movingPlatforms);
    this.game.world.bringToTop(this.game.groups.arrows);
    this.game.world.bringToTop(this.game.groups.projectiles);
    this.game.world.bringToTop(this.game.groups.items);
    this.game.world.bringToTop(this.game.groups.enemies);
    this.game.world.bringToTop(defaultScene.myPit);


    this.game.groups.movingPlatforms.add(new movingPlatform(this.game, 2000, 14700, 'movingPlatform'));
  },

  update: function(){
    //Tilemap colisions
    this.game.physics.arcade.collide(defaultScene.myPit, defaultScene.platformsLayer);
    this.game.physics.arcade.collide(this.game.groups.enemies, defaultScene.platformsLayer);
    this.game.physics.arcade.collide(this.game.groups.enemies, defaultScene.colisionLayer);
    this.game.physics.arcade.collide(this.game.groups.enemies, this.game.groups.movingPlatforms);
    this.game.physics.arcade.collide(this.game.groups.arrows, defaultScene.colisionLayer, killCollObj);
    this.game.physics.arcade.collide(defaultScene.myPit, defaultScene.colisionLayer);
    this.game.physics.arcade.overlap(this.game.groups.enemies, this.game.groups.arrows, arrowHit);
    this.game.physics.arcade.overlap(defaultScene.myPit, this.game.groups.enemies, passDamage);
    this.game.physics.arcade.overlap(defaultScene.myPit, this.game.groups.projectiles, passDamage);
    this.game.physics.arcade.overlap(defaultScene.myPit, this.game.groups.items, pickUp);
    this.game.physics.arcade.collide(defaultScene.myPit, this.game.groups.movingPlatforms);
    this.game.physics.arcade.collide(this.game.groups.movingPlatforms, defaultScene.colisionLayer);


    function killCollObj(obj, coll){
      obj.kill();
    }

    function arrowHit (enemy, arrow) {
      enemy.receiveDamage(arrow.onHit());

    }

    function passDamage (victim, aggressor){
      victim.damage(aggressor.attackDamage);
    }

    function pickUp (pit, item){
      item.onPickUp();
    }
  },

  shutdown: function(){
    if (this.game.newLevel == true){
      defaultScene.savePitVariables.call(this);
      this.game.newLevel = false;
    }

    //Cleans up the memory
    this.game.load.reset();
    this.game.world.removeAll(true);

    defaultScene.myPit = null;
    defaultScene.map = null;
    defaultScene.mapLayer = null;
    defaultScene.colisionLayer = null;
    defaultScene.platformsLayer = null;
    defaultScene.enemiesLayer = null;
    defaultScene.itemLayer = null;
  },

  createTileMap: function(){
    defaultScene.map = this.game.add.tilemap('level');
    defaultScene.map.addTilesetImage('leveltileset');
    defaultScene.map.addTilesetImage('ColisionsTile');
    defaultScene.map.addTilesetImage('EnemiesTileset');

    defaultScene.mapLayer = defaultScene.map.createLayer('Map');
    defaultScene.mapLayer.setScale(config.scale);
    defaultScene.mapLayer.fixedCamera = false;

    defaultScene.edgeLayer = defaultScene.map.createLayer('Edges');
    defaultScene.edgeLayer.setScale(config.scale);
    defaultScene.edgeLayer.visible = false;

    defaultScene.colisionLayer = defaultScene.map.createLayer('Colisions');
    defaultScene.colisionLayer.setScale(config.scale);
    defaultScene.colisionLayer.fixedCamera = false;
    defaultScene.colisionLayer.visible = false;

    defaultScene.platformsLayer = defaultScene.map.createLayer('Platforms');
    defaultScene.platformsLayer.setScale(config.scale);
    defaultScene.platformsLayer.fixedCamera = false;
    defaultScene.platformsLayer.visible = false;

    defaultScene.enemiesLayer = defaultScene.map.createLayer('Enemies');
    defaultScene.enemiesLayer.setScale(config.scale);
    defaultScene.enemiesLayer.fixedCamera = false;
    defaultScene.enemiesLayer.visible = false;

    defaultScene.itemLayer = defaultScene.map.createLayer('Items');
    defaultScene.itemLayer.setScale(config.scale);
    defaultScene.itemLayer.fixedCamera = false;
    defaultScene.itemLayer.visible = false;

    defaultScene.mapLayer.resizeWorld();

    defaultScene.map.setCollision(this.colisionBlockID, true, 'Colisions');
    defaultScene.map.setCollision(this.edgesBlockID, true, 'Edges');
    defaultScene.map.setCollision(this.platformsBlockID, true, 'Platforms');

    //Spawns enemies UNFINISHED
    defaultScene.map.forEach(function (tile){
      var newEnemy = null;
      if (tile.properties != undefined && tile.properties.enemyType != undefined){
        switch (tile.properties.enemyType){
          case "shemum": newEnemy = new shemum(this.game, tile.worldX, tile.worldY, 'enemies', -1); break;
          case "monoeye": newEnemy = new monoeye(this.game, tile.worldX, tile.worldY, 'enemies', defaultScene.myPit); break;
          case "reaper": newEnemy = new reaper(this.game, tile.worldX, tile.worldY, 'enemies', -1, defaultScene.myPit, defaultScene.edgeLayer); break;
          case "mcgoo": newEnemy = new mcgoo(this.game, tile.worldX, tile.worldY, 'enemies', defaultScene.myPit); break;
          case "nettler": newEnemy = new nettler(this.game, tile.worldX, tile.worldY, 'enemies', -1, defaultScene.myPit); break;
          case "twinbellows": newEnemy = new twinbellows(this.game, tile.worldX, tile.worldY, 'twinbellows', defaultScene.myPit); break;
          default: newEnemy = null; break;
        }
      }

      if (newEnemy != null){
        this.game.groups.enemies.add(newEnemy);
      }
    }, this, 0, 0, defaultScene.map.width, defaultScene.map.height, defaultScene.enemiesLayer);

    //Spawns items
    defaultScene.map.forEach(function (tile){
      var newItem = null;
      if (tile.properties != undefined && tile.properties.itemType != undefined){
        switch (tile.properties.itemType){
          case "chalice": newItem = new chalice(this.game, tile.worldX, tile.worldY, 'lifeWater', defaultScene.myPit); break;
          case "bottle": newItem = new bottle(this.game, tile.worldX, tile.worldY, 'lifeWater'); break;
          case "barrel": newItem = new barrel(this.game, tile.worldX, tile.worldY, 'barrel'); break;
          case "strengthArrow": newItem = new strengthArrow(this.game, tile.worldX, tile.worldY, 'powerUps'); break;
          case "angelFeather": newItem = new angelFeather(this.game, tile.worldX, tile.worldY, 'powerUps'); break;
          case "sacredBow": newItem = new sacredBow(this.game, tile.worldX, tile.worldY, 'powerUps'); break;
          default: newItem = null; break;
        }
      }

      if (newItem != null){
        this.game.groups.items.add(newItem);
      }
    }, this, 0, 0, defaultScene.map.width, defaultScene.map.height, defaultScene.itemLayer);

    /*//Spawns platforms
    defaultScene.map.forEach(function (tile){
      var newMovingPlatform = null;
      if (tile.properties != undefined && tile.properties.movingPlatform != undefined){
          newMovingPlatform = new movingPlatform(this.game, tile.worldX, tile.worldY, 'movingPlatform');
        }

      if (newMovingPlatform != null){
        this.game.groups.movingPlatforms.add(new);
      }
    }, this, 0, 0, defaultScene.map.width, defaultScene.map.height, defaultScene.itemLayer);
*/
    //Sets platforms specific side collisions
    defaultScene.map.forEach(function (tile){
      tile.collideDown = false;
      tile.collideRight = false;
      tile.collideLeft = false;
    }, this.game, 0, 0, defaultScene.map.width, defaultScene.map.height, defaultScene.platformsLayer);

    //Set the bounds to use only the first map of the tilemap
    this.game.world.setBounds(config.tileSize*config.scale+1, 0,
      this.game.world.bounds.width/2 - (2*config.tileSize*config.scale)-1,
      this.game.world.bounds.height);
      //The ''-1' fixes the vagueness caused by the division/multiplication
  },

  savePitVariables: function(){
    this.game.pitVariables.hearts = this.game.hearts;
    this.game.pitVariables.bottles = this.game.bottles;
    this.game.pitVariables.maxBottles = this.game.maxBottles;
    this.game.pitVariables.bonusDamage = this.game.bonusDamage;
    this.game.pitVariables.hasSacredBow = this.game.hasSacredBow;

    this.game.pitVariables.health = defaultScene.myPit.health;
    this.game.pitVariables.maxHealth = defaultScene.myPit.maxHealth;
  }
};

module.exports = defaultScene;
