//level1.js
'use strict';

var entity = require('../Entities/entity.js');
var config = require('../config.js');

var initialMenu = {
  controlsScreen: undefined,
  exitKey: undefined,

  preload: function(){

  },

  create: function(){
    this.controlsScreen = new entity (this.game, 0, 0, 'controlsScreen');
    this.controlsScreen.anchor.setTo(0, 0);

    this.exitKey = this.game.input.keyboard.addKey(config.exitKey);
    this.exitKey.onDown.add(this.exitControlsCallback, this);
  },

  update: function(){

  },

  exitControlsCallback: function(){
    this.game.state.start('initialMenu', true, false);
  },

  shutdown: function(){
    this.controlsScreen = null;
    this.exitKey = null;
  }
};

module.exports = initialMenu;
