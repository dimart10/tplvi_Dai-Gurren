//main.js
'use strict';

module.exports.Phaser = Phaser;
var level1 = require('./Scenes/level1.js');
var level2 = require('./Scenes/level2.js');

var BootScene = {
  preload: function () {
    this.game.time.desiredFps = 60;
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
  },

  create: function () {
    this.game.state.start('level2');
  }
};

window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', level1);
  game.state.add('level2', level2);

  game.state.start('boot');
};
