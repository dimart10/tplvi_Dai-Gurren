//levelEnd.js

var item = require('./item.js');
var config = require('../../config.js');

function teleport(game, x, y, destinyX, destinyY, name, comeback, pit){
  item.call(this, game, x, y, name);
  this.myPit = pit;
  this.destinyX = destinyX;
  this.destinyY = destinyY;
  this.comeback = comeback;
}

teleport.prototype = Object.create(item.prototype);

teleport.prototype.effect = function(){
  if (!this.comeback){
    //Set the bounds to use only the second map of the tilemap
    this.game.world.setBounds(config.tileSize*19*config.scale + 1, 0, config.tileSize*config.scale*16,this.game.world.bounds.height);
                              //The ''-1' fixes the vagueness caused by the division/multiplication

    var comebackTeleport = new teleport(this.game, this.destinyX+config.tileSize*config.scale+18, this.destinyY,
                                        this.x, this.y, 'pit', true, this.myPit);
    this.game.groups.items.add(comebackTeleport);

    this.myPit.x = this.destinyX;
    this.myPit.y = this.destinyY;
  }
  else{
    //Set the bounds to use only the first map of the tilemap
    this.game.world.setBounds(config.tileSize*config.scale+1, 0,
                              config.tileSize*config.scale*16,
                              this.game.world.bounds.height);
                              //The ''-1' fixes the vagueness caused by the division/multiplication

    this.myPit.x = this.destinyX;
    this.myPit.y = this.destinyY;
  }
}

module.exports = teleport;
