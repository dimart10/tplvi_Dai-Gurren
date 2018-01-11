//defaultScene.js
'use strict';

/*Every normal level of the game should call these object's methods
passing them its own scope with '.call' or '.apply'. This will
automatically manage entities such as Pit character or the UI, which
are on every level.*/

var defaultScene = {
  entities: [],

  preload: function(){
    this.game.time.desiredFps = 60;
    this.game.load.spritesheet('pit', 'images/characters/pit.png', 29, 29, 180);
    this.game.load.image('arrow', 'images/scenary/arrow(bigger).png');
    this.game.load.image('magmaShot', 'images/scenary/magmaShot.png');
    this.game.load.spritesheet('enemies', 'images/characters/enemies.png', 30, 30, 150)
  },

  create: function(){
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 3500;
  },

  update: function(){
    for (var i = 0; i < defaultScene.entities.length; i++){
      defaultScene.entities[i].update();
    }
  },

  shutdown: function(){
    for (var i = 0; i < defaultScene.entities.length; i++){
      defaultScene.entities[i] = null;
    }
    entities = null;
  }
};

module.exports = defaultScene;
