//defaultScene.js

var pit = require('../Entities/Characters/pit.js');

var defaultScene = {
  myPit: undefined,

  preload: function(){
    myPit = new pit();
  },

  create: function(){
    myPit.create();
  }
};

module.exports = defaultScene;
