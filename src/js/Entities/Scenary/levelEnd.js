//levelEnd.js

var item = require('./item.js');

function levelEnd(game, x, y, name, nextState){
  item.call(this, game, x, y, name);
  this.nextState = nextState;
}

levelEnd.prototype = Object.create(item.prototype);

levelEnd.prototype.effect = function(){
  this.game.state.start(this.nextState);
}

module.exports = levelEnd;
