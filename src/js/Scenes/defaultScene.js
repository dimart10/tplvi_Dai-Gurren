//defaultScene.js

var pit = require('../Entities/Characters/pit.js');

var defaultScene = {
  myPit: undefined,
  entities: [],

  createSprite: function(name, x, y, game){
    var sprite = game.add.sprite(x, y, name);
    sprite.anchor.setTo(0, 0);

    return sprite;
  },

  preload: function(){
    this.game.load.spritesheet('pit', '../../images/characters/pit.png', 45, 45, 26);
  },

  create: function(){
    var pitSprite = defaultScene.createSprite('pit', 1, 1, this.game);
    myPit = pit(1, 1, pitSprite);
    myPit.newAnimation('walk', [21, 22, 23, 24], 5, true, true);
  },

  update: function(){}
};

module.exports = defaultScene;
