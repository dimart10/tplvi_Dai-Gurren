'use strict';

module.exports.Phaser = Phaser;
var level1 = require('./Scenes/level1.js');

var BootScene = {
  preload: function () {

  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {

  },

  create: function () {
    this.game.state.start('play');
  }
};

window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.load.baseURL = 'https://dimart10.github.io/tplvi_Dai-Gurren/';
  game.load.crossOrigin = 'anonymous';

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', level1);

  game.state.start('boot');
};
