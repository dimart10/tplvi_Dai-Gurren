//hud.js
'use strict'

var HealthBar = require("../Utilities/HealthBar.js");
var config = require("../config.js");

var HUD = {
  myHealthBar: undefined,
  game: undefined,

  create: function(game){
    this.game = game;

    config.barConfig.width = config.initialPitHealth * config.pixelsPerLifePoint;

    this.myHealthBar = new HealthBar(game, config.barConfig);
    this.myHealthBar.setFixedToCamera(true);
    this.myHealthBar.setPercent(100);
  }
}

module.exports = HUD;
