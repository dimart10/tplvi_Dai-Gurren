//deadMenu.js
'use strict';

var entity = require('../Entities/entity.js');
var config = require('../config.js');

var deadMenu = {
  controlsScreen: undefined,
  exitKey: undefined,
  timer: 0,

  preload: function(){

  },

  create: function(){
    this.deadScreen = new entity (this.game, 0, 0, 'deadScreen');
    this.deadScreen.width = 800;
    this.deadScreen.height = 600;
    this.deadScreen.anchor.setTo(0, 0);

    this.game.game_over.play();
  },

  update: function(){
    if (this.timer >= config.deadScreenTime){
      this.game.state.start(this.game.restartLevel, true, false);
      this.game.sound.stopAll();
    } else {
      this.timer++;
    }
  },

  shutdown: function(){
    this.deadScreen = null;
  }
};

module.exports = deadMenu;
