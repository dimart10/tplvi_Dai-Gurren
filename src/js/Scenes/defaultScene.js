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
    this.game.load.spritesheet('enemies', 'images/characters/enemies.png', 30, 30, 195)
    this.game.load.spritesheet('twinbellows', 'images/characters/twinbellows.png', 42, 26, 4)
  },

  create: function(){
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 3500;
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
