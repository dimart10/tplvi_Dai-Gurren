//defaultScene.js

/*Every normal level of the game should call these object's methods
passing them its own scope with '.call' or '.apply'. This will
automatically manage entities such as Pit character or the UI, which
are on every level.*/

var pit = require('../Entities/Characters/pit.js');
var entities = [];

var defaultScene = {
  myPit: undefined,
  entities: [],

  preload: function(){
    this.game.load.spritesheet('pit', '../../images/characters/pit.png', 45, 45, 26);
  },

  create: function(){
    var pitSprite = defaultScene.createSprite('pit', 0, 0, this.game);
    defaultScene.myPit = new pit(0, 0, pitSprite);
    defaultScene.myPit.newAnimation('walk', [21, 22, 23, 24], 5, true, true);
    defaultScene.entities.push(defaultScene.myPit);
  },

  update: function(){
    for (var i = 0; i < defaultScene.entities.length; i++){
      defaultScene.entities[i].update();
    }
  },

  createSprite: function(name, x, y, game){
    var sprite = game.add.sprite(x, y, name);
    sprite.anchor.setTo(0, 0);

    return sprite;
  }
};

module.exports = defaultScene;
