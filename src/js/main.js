'use strict';

module.exports.Phaser = Phaser;
var level1 = require('./Scenes/level1.js');

var BootScene = {
  preload: function () {
    //this.game.load.baseURL = 'https://dimart10.github.io/tplvi_Dai-Gurren/src';
    //this.game.load.crossOrigin = 'anonymous';
    alert("BIENVENIDO");
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    //this.game.load.image('logo', 'images/phaser.png');
  },

  create: function () {
    this.game.state.start('play');
  }
};

window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', level1);

  game.state.start('boot');
};
