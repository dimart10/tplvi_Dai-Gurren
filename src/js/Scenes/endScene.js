//endScene.js
'use strict';

var entity = require('../Entities/entity.js');
var config = require('../config.js');

var endScene = {
  controlsScreen: undefined,
  exitKey: undefined,

  preload: function(){
this.game.credits = this.game.add.audio('credits');
  },

  create: function(){
    this.endScreen = new entity (this.game, 50, 0, 'endScreen');
    this.endScreen.anchor.setTo(0, 0);

    this.game.sound.stopAll();
    this.game.credits.play();
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

module.exports = endScene;
