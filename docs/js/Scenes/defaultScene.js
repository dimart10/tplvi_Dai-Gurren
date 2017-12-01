//defaultScene.js

/*Every normal level of the game should call these object's methods
passing them its own scope with '.call' or '.apply'. This will
automatically manage entities such as Pit character or the UI, which
are on every level.*/

var defaultScene = {
  myPit: undefined,
  entities: [],

  preload: function(){
    this.game.load.spritesheet('pit', '../../images/characters/pit.png', 29, 29, 180);
    this.game.load.image('box', '../../images/scenary/box.png');
    this.game.load.image('arrow', '../..images/scenary/arrow.png');
  },

  create: function(){
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.gravity.y = 150;
  },

  update: function(){
    for (var i = 0; i < defaultScene.entities.length; i++){
      defaultScene.entities[i].update();
    }
  }
};

module.exports = defaultScene;