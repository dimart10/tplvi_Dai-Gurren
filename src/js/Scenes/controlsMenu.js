//controlsMenu.js
'use strict';

var entity = require('../Entities/entity.js');
var config = require('../config.js');

var controlsMenu = {
  controlsScreen: undefined,
  exitKey: undefined,

  create: function(){
    this.controlsScreen = new entity (this.game, 0, 0, 'controlsScreen');
    this.controlsScreen.anchor.setTo(0, 0);

    this.exitKey = this.game.input.keyboard.addKey(config.exitKey);
    this.exitKey.onDown.add(this.exitControlsCallback, this);
  },

  exitControlsCallback: function(){
    this.game.state.start('initialMenu', true, false);
  },

  shutdown: function(){
    this.controlsScreen = null;
    this.exitKey = null;
  }
};

module.exports = controlsMenu;
