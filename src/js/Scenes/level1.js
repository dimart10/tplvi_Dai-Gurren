//level1.js

var defaultScene = require('./defaultScene.js');
var terrain = require('../Entities/Scenary/terrain.js');

var level1 = {
  preload: function(){
    defaultScene.preload.call(this);
  },

  create: function(){
    defaultScene.create.call(this);

    for (var i = 0; i < 14; i++){
      var box = new terrain(this.game, 40 + i*55, 550, 'box');
      defaultScene.entities.push(box);
    }
  },

  update: function(){
    defaultScene.update.call(this);
  }
};

module.exports = level1;
