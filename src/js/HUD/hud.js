//hud.js
'use strict'

var HealthBar = require("../Utilities/HealthBar.js");
var config = require("../config.js");

var HUD = {
  myHealthBar: undefined,
  game: undefined,

  create: function(game){
    this.game = game;

    var barConfig = Object.assign({}, config.barConfig);

    barConfig.width = this.game.pitVariables.maxHealth * config.pixelsPerLifePoint;
    barConfig.x = barConfig.x + barConfig.width/2;

    this.myHealthBar = new HealthBar(game, barConfig);
    this.myHealthBar.setFixedToCamera(true);
    this.myHealthBar.setPercent(this.game.pitVariables.health/this.game.pitVariables.maxHealth * 100);
  }
}

module.exports = HUD;
