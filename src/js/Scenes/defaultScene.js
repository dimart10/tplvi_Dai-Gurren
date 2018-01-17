//defaultScene.js
'use strict';

/*Every normal level of the game should call these object's methods
passing them its own scope with '.call' or '.apply'. This will
automatically manage entities such as Pit character or the UI, which
are on every level.*/

var defaultScene = {

  preload: function(){
    this.game.time.desiredFps = 60;
    this.game.load.spritesheet('pit', 'images/characters/pit.png', 29, 29, 180);
    this.game.load.image('arrow', 'images/scenary/arrow(bigger).png');
    this.game.load.image('magmaShot', 'images/scenary/magmaShot.png');
    this.game.load.spritesheet('enemies', 'images/characters/enemies.png', 30, 30, 195);
    this.game.load.spritesheet('twinbellows', 'images/characters/twinbellows.png', 42, 26, 4);
    this.game.load.spritesheet('heart', 'images/scenary/heart.png', 14, 14, 3);

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
    this.game.load.audio('stat_boost', 'audio/sfx/stat_boost.mp3');
    this.game.load.audio('walk', 'audio/sfx/walk.mp3');
    this.game.load.audio('enemy_death', 'audio/sfx/enemy_death.mp3');
  },

  create: function(){
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 3500;
    this.game.hearts;
  },

  update: function(){

  },

  shutdown: function(){
    //Cleans up the memory

    this.game.load.reset();
    this.game.world.removeAll(true);
  }
};

module.exports = defaultScene;
