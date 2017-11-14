//pit.js
var entity = require('../entity.js');

function pit(x, y){
  entity.call(this, x, y);
  this.game.load.spritesheet('pit', '../../images/characters/pit.png', 45, 45, 26);

  this.create = function(){
    var pitSprite = this.game.add.sprite(1, 1, 'pit');
    pitSprite.anchor.setTo(0, 0);

    pitSprite.animations.add('walk', [21, 22, 23, 24], 5, true);
    pitSprite.animations.play('walk');
  };
}

module.exports = pit;
