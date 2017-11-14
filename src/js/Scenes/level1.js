//level1.js
var defaultScene = require('./defaultScene.js');

var level1 = {
  preload: function(){
    defaultScene.preload.call(this);
  },

  create: function(){
    defaultScene.create.call(this);
  },

  update: function(){
    
  }
};

module.exports = level1;
