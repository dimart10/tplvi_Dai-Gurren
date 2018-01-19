//main.js
'use strict';

module.exports.Phaser = Phaser;
var level1 = require('./Scenes/level1.js');
var level2 = require('./Scenes/level2.js');
var level3 = require('./Scenes/level3.js');
var BootScene = {
  preload: function () {
    this.game.time.desiredFps = 60;

    this.game.load.spritesheet('pit', 'images/characters/pit.png', 29, 29, 180);
    this.game.load.image('arrow', 'images/scenary/arrow.png');
    this.game.load.image('magmaShot', 'images/scenary/magmaShot.png');
    this.game.load.image('barrel', 'images/scenary/barrel.png');
    this.game.load.spritesheet('enemies', 'images/characters/enemies.png', 30, 30, 195);
    this.game.load.spritesheet('twinbellows', 'images/characters/twinbellows.png', 42, 26, 4);
    this.game.load.spritesheet('heart', 'images/scenary/heart.png', 14, 14, 3);
    this.game.load.spritesheet('lifeWater', 'images/scenary/lifeWater.png', 10, 16, 2);
    this.game.load.spritesheet('powerUps', 'images/scenary/powerUps.png', 8, 16, 3);
    this.game.load.image('movingPlatform', 'images/scenary/movingPlatform.png');

    this.game.load.audio('underworld', 'audio/music/underworld.mp3');
    this.game.load.audio('game_over', 'audio/music/game_over.mp3');
    this.game.load.audio('reaper_spotted', 'audio/music/reaper_spotted.mp3');
    this.game.load.audio('victory', 'audio/music/victory.mp3');
    this.game.load.audio('arrow_shot', 'audio/sfx/arrow_shot.mp3');
    this.game.load.audio('enemy_damage', 'audio/sfx/enemy_damage.mp3');
    this.game.load.audio('get_item', 'audio/sfx/get_item.mp3');
    this.game.load.audio('jump', 'audio/sfx/jump.mp3');
    this.game.load.audio('pit_hit', 'audio/sfx/pit_hit.mp3');
    this.game.load.audio('reaper_alert', 'audio/sfx/reaper_alert.mp3');
    this.game.load.audio('walk', 'audio/sfx/walk.mp3');
    this.game.load.audio('enemy_death', 'audio/sfx/enemy_death.mp3');
    this.game.load.audio('power_up', 'audio/sfx/power_up.mp3');
  },

  create: function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 3500;

    this.game.state.start('play');
  }
};

window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('play', level1);
  game.state.add('level2', level2);
  game.state.add('level3', level3);

  game.state.start('boot');
};
