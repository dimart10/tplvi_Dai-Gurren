//defaultScene.js

/*Every normal level of the game should call these object's methods
passing them its own scope with '.call' or '.apply'. This will
automatically manage entities such as Pit character or the UI, which
are on every level.*/

var pit = require('../Entities/Characters/pit.js');

var defaultScene = {
  myPit: undefined,
  entities: [],

  preload: function(){
    this.game.load.spritesheet('pit', '../../images/characters/pit.png', 45, 45, 26);
    this.game.load.image('box', '../../images/scenary/box.png');
  },

  create: function(){
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.gravity.y = 150;
    defaultScene.myPit = new pit(this.game, 50, 480, 'pit');
    defaultScene.entities.push(defaultScene.myPit);
  },

  update: function(){
    for (var i = 0; i < defaultScene.entities.length; i++){
      defaultScene.entities[i].update();
    }
  }
};

module.exports = defaultScene;
