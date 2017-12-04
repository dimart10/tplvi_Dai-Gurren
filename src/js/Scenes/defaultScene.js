//defaultScene.js
'use strict';

/*Every normal level of the game should call these object's methods
passing them its own scope with '.call' or '.apply'. This will
automatically manage entities such as Pit character or the UI, which
are on every level.*/

var defaultScene = {
  myPit: undefined,
  entities: [],

  preload: function(){
    this.game.load.spritesheet('pit', '../../images/characters/pit.png', 29, 29, 180);
    this.game.load.image('arrow', '../../images/scenary/arrow(bigger).png');
  },

  create: function(){
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 300;
  },

  update: function(){
    for (var i = 0; i < defaultScene.entities.length; i++){
      defaultScene.entities[i].update();
    }
  }
};

module.exports = defaultScene;
