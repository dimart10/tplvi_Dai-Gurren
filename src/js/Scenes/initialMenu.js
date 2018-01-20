//level1.js
'use strict';

var defaultScene = require('./defaultScene.js');
var entity = require('../Entities/entity.js');
var button = require('../Entities/Menus/button.js')
var config = require('../config.js');

var initialMenu = {
  titleScreen: undefined,
  cursors: undefined,
  selectKey: undefined,
  selection: 0,
  buttons: [],

  preload: function(){

  },

  create: function(){
    this.game.world.setBounds(0, 0, 800, 600);

    this.titleScreen = new entity (this.game, 0, 0, 'titleScreen');
    this.titleScreen.anchor.setTo(0, 0);

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.selectKey = this.game.input.keyboard.addKey(config.menuSelectKey);

    this.cursors.down.onDown.add(this.selectionDown, this);
    this.cursors.up.onDown.add(this.selectionUp, this);
    this.selectKey.onDown.add(this.selectButton, this);

    var playButton = new button(this.game, 400, 350, 'playButton', this.level1Callback)
    this.buttons.push(playButton);

    var controlsButton = new button(this.game, 400, 450, 'controlsButton', this.controlsCallback)
    this.buttons.push(controlsButton);

    this.buttons[this.selection].selected = true;
  },

  update: function(){

  },

  selectionUp: function(){
    this.buttons[this.selection].selected = false;

    if (this.selection < this.buttons.length-1) this.selection++;
    else this.selection = 0;

    this.buttons[this.selection].selected = true;
  },

  selectionDown: function(){
    this.buttons[this.selection].selected = false;

    if (this.selection > 0) this.selection--;
    else this.selection = this.buttons.length - 1;

    this.buttons[this.selection].selected = true;
  },

  selectButton: function(){
    this.buttons[this.selection].onClickCallback();
  },

  level1Callback: function(){
    this.game.state.start('play', true, false);
  },

  controlsCallback: function(){
    this.game.state.start('controlsMenu', true, false);
  },

  shutdown: function(){
    this.titleScreen = null;
    this.cursors = null;
    this.selectKey = null;
    this.selection = 0;
    this.buttons = [];
  }
};

module.exports = initialMenu;
