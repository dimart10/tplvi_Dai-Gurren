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

    this.heartImage = game.add.sprite(config.heartHUD.x, config.heartHUD.y, 'heartHud');
    this.heartImage.scale.setTo(config.heartHUD.scale, config.heartHUD.scale);
    this.heartImage.fixedToCamera = true;

    this.game.heartText = this.game.add.text(config.heartText.x, config.heartText.y,
      config.heartText.startValue, {
        font: config.heartText.font,
        fill: config.heartText.color,
        align: "center"
    });
    this.game.heartText.stroke = config.heartText.strokeColor;
    this.game.heartText.strokeThickness = config.heartText.strokeThickness;
    this.game.heartText.fixedToCamera = true;
    this.game.heartText.anchor.setTo(0, 0.5);

  }
}

module.exports = HUD;
