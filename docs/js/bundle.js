(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//pit.js
'use strict'

var entity = require('../entity.js');
var arrow = require('../Scenary/arrow.js');
var config = require('../../config.js');
var HUD = require('../../HUD/hud.js');

function pit(game, x, y, name, groups){
  entity.call(this, game, x, y, name);
  this.game = game;
  this.groups=groups;

  this.game.camera.follow(this);

  this.scale.setTo(config.scale, config.scale);
  this.game.physics.arcade.enable(this);
  this.body.setSize(13, 24, 7, 0);
  this.body.collideWorldBounds = false;
  this.body.maxVelocity.y = 800;

  this.newAnimation('stillRight', [7], 0, false, true);
  this.newAnimation('stillLeft', [6], 0, false, false);
  this.newAnimation('walkRight', [10, 9, 8, 7], 15, true, false);
  this.newAnimation('walkLeft', [3, 4, 5, 6], 15, true, false);
  this.newAnimation('stillUp', [37], 0, false, false);
  this.newAnimation('stillDown', [0], 0, false, false);

  this.arrowKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.cursors = this.game.input.keyboard.createCursorKeys(); //TESTIN");

  this.maxHealth = config.initialPitHealth;
  this.health = config.initialPitHealth;

  this.jumptimer=0;
  this.jumpTime=10;
  this.direction=1;
  this.arrowtimer=0;
  this.canBeHit = true;
  this.hitTimer = 0;
}

pit.prototype = Object.create(entity.prototype); //Inherits from entity

pit.prototype.newAnimation = function (name, frames, fps, repeat, playOnCreate){
  this.animations.add(name, frames, fps, repeat);
  if (playOnCreate) this.animations.play(name);
}

pit.prototype.update = function(){
  this.move();
  this.jump();
  this.hitCount();
  this.handleDead();

  this.arrowKey.onDown.add(this.shoot, this, 0);
  this.arrowtimer++;
}

pit.prototype.move = function(){
  if (this.cursors.left.isDown) {
		    this.body.velocity.x = -200;
        this.animations.play("walkLeft");
        this.direction=-1;
      }
      else if (this.cursors.right.isDown){
		    this.body.velocity.x = 200;
        this.animations.play("walkRight");
        this.direction=1;
      }
      else if(this.cursors.up.isDown){
        this.animations.play("stillUp");
        this.direction=0;
        this.body.velocity.x=0;
      }
      else if(this.cursors.down.isDown){
        this.animations.play("stillDown");
        this.direction=2;
        this.body.velocity.x=0;
      }
      else{
        this.body.velocity.x = 0;
        if (this.animations.name == "walkRight") this.animations.play("stillRight");
        else if (this.animations.name == "walkLeft") this.animations.play("stillLeft");
      }

      //Processes toroidal movement
      this.game.world.wrap(this, 0, false, true, false);
}

pit.prototype.jump = function(){

  if(this.spacebar.isDown && this.body.onFloor()) {
    this.jumptimer=1;
    this.body.velocity.y = -this.body.maxVelocity.y;
  }

  else if(this.spacebar.isDown && (this.jumptimer!=0))  {
      if(this.jumptimer > this.jumpTime){
        this.jumptimer=0;
      }
      else{
        this.jumptimer++;
        this.body.velocity.y=-900;
      }
    }

  else if (this.jumptimer != 0){
    this.jumptimer=0;
  }
}

pit.prototype.handleDead = function(){
  if (this.health <= 0){
    this.x = config.level1initialPos.x;
    this.y = config.level1initialPos.y;

    this.health = this.maxHealth;
    HUD.myHealthBar.setPercent(100);
  }
}

pit.prototype.damage = function(points){
  if (this.canBeHit){
    this.health -= points;
    HUD.myHealthBar.setPercent((this.health/this.maxHealth) * 100);
    this.canBeHit = false;
  }
}

pit.prototype.hitCount = function(){
  if (!this.canBeHit){
    if (this.hitTimer < config.framesBetweenHit) this.hitTimer++;
    else{
     this.canBeHit = true;
     this.hitTimer = 0;
    }
  }
}

pit.prototype.shoot = function(){
  if(this.direction!=2 && this.arrowtimer>=30){
      this.groups.arrows.add(new arrow(this.game, this.position.x,
        this.position.y, "arrow", this.direction));
      this.arrowtimer=0;
    }
}

module.exports = pit;

},{"../../HUD/hud.js":11,"../../config.js":15,"../Scenary/arrow.js":9,"../entity.js":10}],2:[function(require,module,exports){
//enemy.js
'use strict';

var entity = require('../entity.js');

function enemy(game, x, y, name){
  entity.call(this, game, x, y, name);
  this.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = false;
  this.maxHealth;
  this.attackDamage;
  this.alive=true;
  this.health;

}

enemy.prototype = Object.create(entity.prototype);//inherit from entity

enemy.prototype.receiveDamage =function(arrow){
  this.health-=arrow.damage;
  if(this.health<=0) this.destroy();
}

module.exports = enemy;

},{"../entity.js":10}],3:[function(require,module,exports){
//flying.js
'use strict';

var enemy = require('./enemy.js');

function flying(game, x, y, name, player){
  enemy.call(this, game, x, y, name);
  this.body.allowGravity= false;
  this.goalX;
  this.goalY;
  this.velocity;
  this.radius;
  this.rotateangle =0;
}

flying.prototype = Object.create(enemy.prototype);//inherit from enemy

//goal does a W trajectory around the player, this chases the goal
flying.prototype.swoop = function(){
  var fixRatio= this.radius;
  if(Math.round(Math.cos((this.rotateangle)))==-1) fixRatio*=-1;
  this.goalX = this.radius * Math.cos((this.rotateangle/1.5)) + this.player.x + fixRatio;
  this.goalY = -this.radius * Math.cos((this.rotateangle)) + this.player.y;
  if(this.x< this.goalX) this.x+=this.velocity;
  else if(this.x> this.goalX) this.x-=this.velocity;
  if(this.y< this.goalY) this.y+=this.velocity;
  else if(this.y> this.goalY) this.y -= this.velocity;

  this.rotateangle+=.02;


}


module.exports = flying;

},{"./enemy.js":2}],4:[function(require,module,exports){
//monoeye.js
'use strict'

var flying = require('./flying.js');

function monoeye(game, x, y, name, player){
  flying.call(this, game, x, y, name);

  this.player=player;
  this.goalX=this.player.x;
  this.goalY=this.player.y;
  this.velocity=3;
  this.radius=300;
  this.scale.setTo(2.5, 2.5);
  this.body.setSize(20,20, 5, 0);
  this.maxHealth=1;
  this.health=1;
  this.attackDamage=1;


  this.animations.add('right', [21], 0, false);
  this.animations.add('left', [20], 0, false);
  if(this.x>this.player.x) this.animations.play('left');
  else if(this.x<this.player.x) this.animations.play('right');
}

monoeye.prototype = Object.create(flying.prototype);

monoeye.prototype.update = function(){
  this.swoop();
  if(this.x>this.player.x) this.animations.play('left');
  else if(this.x<this.player.x) this.animations.play('right');
}

module.exports = monoeye;

},{"./flying.js":3}],5:[function(require,module,exports){
//reaper.js
'use strict'

var terrestrial = require('./terrestrial.js');
var reapette = require('./reapette.js');

function reaper(game, x, y, name, direction, player, groups){
  terrestrial.call(this, game, x, y, name);
  this.groups=groups;
  this.player=player;
  this.turn=false;
  this.turnTimer=0;
  this.alertTimer=0;
  this.alert=false;
  this.direction=direction;
  this.velocity = 50;
  this.scale.setTo(2.5,2.5);
  this.body.setSize(15, 24, 5, -1);
  this.maxHealth=10;
  this.health=10;
  this.attackDamage=2;
  this.animations.add('patrolRight', [25], 0, false);
  this.animations.add('alertRight', [26,27], 5, true);
  this.animations.add('patrolLeft', [24], 0, false);
  this.animations.add('alertLeft', [22,23], 5, true);
  if(this.direction==1) this.animations.play('patrolRight');
  else if(this.direction==-1) this.animations.play('patrolLeft');



}

reaper.prototype = Object.create(terrestrial.prototype);//inherit from terrestrial

reaper.prototype.update = function(){
if(!this.alert) this.detectPit();
this.movement();
}



reaper.prototype.detectPit = function(){
  if (Math.abs(this.y - this.player.y)<20) {
        if (this.player.x > this.x) {
          if(this.direction==1) this.onAlert();
        }
        else if(this.direction==-1) this.onAlert();
    }
}

reaper.prototype.movement = function(){
if(!this.alert){
  if(this.body.onWall()) {
    this.direction = this.direction*(-1);
    if(this.direction==1) this.animations.play('patrolRight');
    else if(this.direction==-1) this.animations.play('patrolLeft');
  }
}
else{
  this.alertTimer++;
  if(this.alertTimer>300) this.exitAlert();
}
//console.log(this.turn);
if(!this.turn) {
   this.horizMove(this.velocity, this.direction);
   if(this.turnTimer>300) this.onTurn();
}
if(this.turn && this.turnTimer>100) this.exitTurn();
this.turnTimer++;
}

reaper.prototype.onAlert = function(){
    this.alert=true;
    this.turn=false;
    this.turnTimer=0;
    if(this.direction==1) this.animations.play('alertRight');
    else if(this.direction==-1) this.animations.play('alertLeft');
    this.velocity*=3;
    this.groups.enemies.add(new reapette(this.game, this.x, this.y -200, 'enemies', this.player));
    this.groups.enemies.add(new reapette(this.game, this.x+30, this.y -230, 'enemies', this.player));
  }

reaper.prototype.exitAlert = function(){
  this.alert=false;
  this.alertTimer=0;
  this.velocity/=3;
  if(this.direction==1) this.animations.play('patrolRight');
  else if(this.direction==-1)this.animations.play('patrolLeft');
}

reaper.prototype.onTurn = function(){
  this.turn=true;
  this.body.velocity.x=0;
  this.turnTimer=0;
  if(this.direction==1)
  {this.direction=-1; this.animations.play('patrolLeft');}
  else if(this.direction==-1)
  {this.direction=1; this.animations.play('patrolRight');}
}

reaper.prototype.exitTurn = function(){
  this.turn=false;
  this.turnTimer=0;
  if(this.direction==1)
  {this.direction=-1; this.animations.play('patrolLeft');}
  else if(this.direction==-1)
  {this.direction=1; this.animations.play('patrolRight');}
}

module.exports = reaper;

},{"./reapette.js":6,"./terrestrial.js":8}],6:[function(require,module,exports){
//reapette.js
'use strict'

var flying = require('./flying.js');

function reapette(game, x, y, name, player){
  flying.call(this, game, x, y, name);

  this.player=player;
  this.goalX=this.player.x;
  this.goalY=this.player.y;
  this.velocity=3;
  this.radius=300;
  this.scale.setTo(2.5, 2.5);
  this.body.setSize(10,20, 5, 0);
  this.maxHealth=1;
  this.health=1;
  this.attackDamage=1;


  this.animations.add('right', [75], 0, false);
  this.animations.add('left', [74], 0, false);
  if(this.x>this.player.x) this.animations.play('left');
  else if(this.x<this.player.x) this.animations.play('right');
}

reapette.prototype = Object.create(flying.prototype);

reapette.prototype.update = function(){
  this.swoop();
  if(this.x>this.player.x) this.animations.play('left');
  else if(this.x<this.player.x) this.animations.play('right');
}

module.exports = reapette;

},{"./flying.js":3}],7:[function(require,module,exports){
//shemum.js
'use strict'

var terrestrial = require('./terrestrial.js');

function shemum(game, x, y, name, direction){
  terrestrial.call(this, game, x, y, name);

  this.direction=direction;
  this.velocity = 150;
  this.scale.setTo(2.5,2.5);
  this.body.setSize(10, 15, 10, 4);
  this.maxHealth=1;
  this.health=1;
  this.attackDamage=1;

  this.animations.add('walkRight', [2, 3], 5, true);
  this.animations.add('walkLeft', [0, 1], 5, true);
  if(this.direction==1) this.animations.play('walkRight');
  else if(this.direction==-1) this.animations.play('walkLeft');
}

shemum.prototype = Object.create(terrestrial.prototype);//inherit from terrestrial

shemum.prototype.update = function(){
this.movement();
}

//Walks in the current direction, if it runs into a wall, the direction is inverted
shemum.prototype.movement = function(){
  if(this.body.onWall()) {
    this.direction = this.direction*(-1);
    if(this.direction==1) this.animations.play('walkRight');
    else if(this.direction==-1) this.animations.play('walkLeft');
  }
  this.horizMove(this.velocity, this.direction);
}
module.exports = shemum;

},{"./terrestrial.js":8}],8:[function(require,module,exports){
//terrestrial.js
'use strict';

var enemy = require('./enemy.js');

function terrestrial(game, x, y, name){
  enemy.call(this, game, x, y, name);
  this.body.maxVelocity.y = 800;
}

terrestrial.prototype = Object.create(enemy.prototype);//inherit from enemy

//Moves toroidally either right or left depeneding on the direction given at
//given the velocity
terrestrial.prototype.horizMove = function(velocity, direction){
  if(this.direction==-1){
    this.body.velocity.x=- velocity;
  }
  else if(this.direction==1){
    this.body.velocity.x= velocity;
  }
  this.game.world.wrap(this, 0, false, true, false);
}

module.exports = terrestrial;

},{"./enemy.js":2}],9:[function(require,module,exports){
//arrow.js
'use strict'

var entity = require('../entity.js');

function arrow(game, x, y, name, direction){
  this.direction = direction;
  this.attackDamage=1;

  if(this.direction==1){
    entity.call(this, game, x+25, y, name);
    this.initialPosition = x;
  }
  else if (this.direction==-1){
    entity.call(this, game, x-25, y, name);
    this.initialPosition = x;
  }
  else if (this.direction==0){
    entity.call(this, game, x, y-35, name);
    this.initialPosition = y;
  }
  else if(this.direction==2){
    entity.call(this, game, x, y, name);
    this.initialPosition = y;
  }

  this.maximumDistance = 220;

  game.physics.arcade.enable(this);
  this.body.allowGravity = false;

  if(direction==0) this.angle=-90;
  else if(direction==-1) this.angle=180;
}

arrow.prototype = Object.create(entity.prototype);

arrow.prototype.update = function(){
  this.move();
  this.cycleOfLife();
}

arrow.prototype.move = function(){
  if (this.direction == 1) this.body.velocity.x = 900;
  else if(this.direction==-1) this.body.velocity.x = -900;
  else if(this.direction==0) this.body.velocity.y = -900;
  else if (this.direction==2) this.body.velocity.y = 900;
}

arrow.prototype.cycleOfLife = function(){
  var currentPosition;
  if (this.direction == 1 || this.direction == -1){
    currentPosition = this.x;
  } else{
    currentPosition = this.y;
  }
  if (Math.abs(currentPosition - this.initialPosition) >= this.maximumDistance)
    this.kill();

  if(this.counter > 75) this.kill();
}

module.exports = arrow;

},{"../entity.js":10}],10:[function(require,module,exports){
//entity.js
'use strict'

var main = require("../main.js");
var Phaser = main.Phaser;

function entity(game, x, y, name){
  Phaser.Sprite.call(this, game, x, y, name);
  game.add.existing(this);
  this.anchor.setTo(0.5, 0.5);
  }

entity.prototype = Object.create(Phaser.Sprite.prototype);
entity.prototype.constructor = entity;
entity.prototype.update = function() {}

module.exports = entity;

},{"../main.js":16}],11:[function(require,module,exports){
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

},{"../Utilities/HealthBar.js":14,"../config.js":15}],12:[function(require,module,exports){
//defaultScene.js
'use strict';

/*Every normal level of the game should call these object's methods
passing them its own scope with '.call' or '.apply'. This will
automatically manage entities such as Pit character or the UI, which
are on every level.*/

var defaultScene = {
  myPit: undefined,
  entities: [],

  preload: function(){
    this.game.time.desiredFps = 60;
    this.game.load.spritesheet('pit', 'images/characters/pit.png', 29, 29, 180);
    this.game.load.image('arrow', 'images/scenary/arrow(bigger).png');
    this.game.load.spritesheet('enemies', 'images/characters/enemies.png', 30, 30, 150)
  },

  create: function(){
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 3500;
  },

  update: function(){
    for (var i = 0; i < defaultScene.entities.length; i++){
      defaultScene.entities[i].update();
    }
  }
};

module.exports = defaultScene;

},{}],13:[function(require,module,exports){
//level1.js
'use strict';

var defaultScene = require('./defaultScene.js');
var pit = require('../Entities/Characters/pit.js');
var shemum = require('../Entities/Enemies/shemum.js');
var reaper = require('../Entities/Enemies/reaper.js');
var config = require('../config.js');
var reapette = require('../Entities/Enemies/reapette.js');
var monoeye = require('../Entities/Enemies/monoeye.js');
var HUD = require("../HUD/hud.js");

var level1 = {
  myPit: undefined,
  map: undefined,
  mapLayer: undefined,
  colisionLayer: undefined,
  platformsLayer: undefined,

  preload: function(){
    defaultScene.preload.call(this);

    this.game.load.image('level1tileset', 'images/scenes/level1tileset.png');
    this.game.load.image('ColisionsTile', 'images/scenes/ColisionsTileset.png');
    this.game.load.tilemap('level1', 'images/scenes/level1.json', null,
                            Phaser.Tilemap.TILED_JSON);
  },

  create: function(){
    defaultScene.create.call(this);

    this.createTileMap();
    HUD.create(this.game);

    this.groups= {};
    this.groups.enemies = this.game.add.group();
    this.groups.arrows = this.game.add.group();

    this.myPit = new pit(this.game, config.level1initialPos.x,
                          config.level1initialPos.y, 'pit', this.groups);
    this.groups.enemies.add(new shemum(this.game, 400, 8850, 'enemies', -1));
    this.myReaper=new reaper(this.game, 300, 8535, 'enemies', -1, this.myPit, this.groups);
    this.groups.enemies.add(this.myReaper);
    this.groups.enemies.add(new monoeye(this.game, 150, 8500, 'enemies', this.myPit));

    defaultScene.entities.push(this.myPit);

  },

  update: function(){
      defaultScene.update.call(this);

      //Tilemap colisions
      this.game.physics.arcade.collide(this.myPit, this.platformsLayer);

      this.game.physics.arcade.collide(this.groups.enemies, this.colisionLayer);
      this.game.physics.arcade.collide(this.groups.arrows, this.colisionLayer, killCollObj);
      this.game.physics.arcade.collide(this.myPit, this.colisionLayer);
      this.game.physics.arcade.collide(this.myReaper, this.edgeLayer);
      this.game.physics.arcade.overlap(this.groups.enemies, this.groups.arrows, arrowHit);
      this.game.physics.arcade.overlap(this.myPit, this.groups.enemies, passDamage);

      function killCollObj(obj, coll){
        obj.kill();
      }

      function arrowHit (enemy, arrow) {
        enemy.damage(arrow.attackDamage);
        arrow.kill();
      }

      function passDamage (victim, aggressor){
        victim.damage(aggressor.attackDamage);
      }
    },
  createTileMap: function(){
    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('level1tileset');
    this.map.addTilesetImage('ColisionsTile');

    this.mapLayer = this.map.createLayer('Map');
    this.mapLayer.setScale(config.scale);
    this.mapLayer.fixedCamera = false;

    this.edgeLayer = this.map.createLayer('Edges');
    this.edgeLayer.setScale(config.scale);
    this.edgeLayer.visible = false;
    this.map.setCollision(5762, true, 'Edges');

    this.colisionLayer = this.map.createLayer('Colisions');
    this.colisionLayer.setScale(config.scale);
    this.colisionLayer.fixedCamera = false;
    this.colisionLayer.visible = false;

    this.platformsLayer = this.map.createLayer('Platforms');
    this.platformsLayer.setScale(config.scale);
    this.platformsLayer.fixedCamera = false;
    this.platformsLayer.visible = false;

    this.mapLayer.resizeWorld();

    this.map.setCollision(5761, true, 'Colisions');
    this.map.setCollision(5764, true, 'Platforms');

    //Sets platforms specific side collisions
    this.map.forEach(function (tile){
      tile.collideDown = false;
      tile.collideRight = false;
      tile.collideLeft = false;
    }, this.game, 0, 0, this.map.width, this.map.height, this.platformsLayer);

    //Set the bounds to use only the first map of the tilemap
    this.game.world.setBounds(config.tileSize*config.scale+1, 0,
      this.game.world.bounds.width/2 - (2*config.tileSize*config.scale)-1,
      this.game.world.bounds.height);
      //The ''-1' fixes the vagueness caused by the division/multiplication
  }
};

module.exports = level1;

},{"../Entities/Characters/pit.js":1,"../Entities/Enemies/monoeye.js":4,"../Entities/Enemies/reaper.js":5,"../Entities/Enemies/reapette.js":6,"../Entities/Enemies/shemum.js":7,"../HUD/hud.js":11,"../config.js":15,"./defaultScene.js":12}],14:[function(require,module,exports){
/**
  https://github.com/bmarwane/phaser.healthbar

 Copyright (c) 2015 Belahcen Marwane (b.marwane@gmail.com)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

var HealthBar = function(game, providedConfig) {
    this.game = game;

    this.setupConfiguration(providedConfig);
    this.setPosition(this.config.x, this.config.y);
    this.drawBackground();
    this.drawHealthBar();
    this.setFixedToCamera(this.config.isFixedToCamera);
};
HealthBar.prototype.constructor = HealthBar;

HealthBar.prototype.setupConfiguration = function (providedConfig) {
    this.config = this.mergeWithDefaultConfiguration(providedConfig);
    this.flipped = this.config.flipped;
};

HealthBar.prototype.mergeWithDefaultConfiguration = function(newConfig) {
    var defaultConfig= {
        width: 250,
        height: 40,
        x: 0,
        y: 0,
        bg: {
            color: '#651828'
        },
        bar: {
            color: '#FEFF03'
        },
        animationDuration: 200,
        flipped: false,
        isFixedToCamera: false
    };

    return mergeObjetcs(defaultConfig, newConfig);
};

function mergeObjetcs(targetObj, newObj) {
    for (var p in newObj) {
        try {
            targetObj[p] = newObj[p].constructor==Object ? mergeObjetcs(targetObj[p], newObj[p]) : newObj[p];
        } catch(e) {
            targetObj[p] = newObj[p];
        }
    }
    return targetObj;
}

HealthBar.prototype.drawBackground = function() {

    var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
    bmd.ctx.fillStyle = this.config.bg.color;
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.config.width, this.config.height);
    bmd.ctx.fill();
    bmd.update();

    this.bgSprite = this.game.add.sprite(this.x, this.y, bmd);
    this.bgSprite.anchor.set(0.5);

    if(this.flipped){
        this.bgSprite.scale.x = -1;
    }
};

HealthBar.prototype.drawHealthBar = function() {
    var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
    bmd.ctx.fillStyle = this.config.bar.color;
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.config.width, this.config.height);
    bmd.ctx.fill();
    bmd.update();

    this.barSprite = this.game.add.sprite(this.x - this.bgSprite.width/2, this.y, bmd);
    this.barSprite.anchor.y = 0.5;

    if(this.flipped){
        this.barSprite.scale.x = -1;
    }
};

HealthBar.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;

    if(this.bgSprite !== undefined && this.barSprite !== undefined){
        this.bgSprite.position.x = x;
        this.bgSprite.position.y = y;

        this.barSprite.position.x = x - this.config.width/2;
        this.barSprite.position.y = y;
    }
};


HealthBar.prototype.setPercent = function(newValue){
    if(newValue < 0) newValue = 0;
    if(newValue > 100) newValue = 100;

    var newWidth =  (newValue * this.config.width) / 100;

    this.setWidth(newWidth);
};

/*
 Hex format, example #ad3aa3
 */
HealthBar.prototype.setBarColor = function(newColor) {
    var bmd = this.barSprite.key;
    bmd.update();

    var currentRGBColor = bmd.getPixelRGB(0, 0);
    var newRGBColor = hexToRgb(newColor);
    bmd.replaceRGB(currentRGBColor.r,
        currentRGBColor.g,
        currentRGBColor.b,
        255 ,

        newRGBColor.r,
        newRGBColor.g,
        newRGBColor.b,
        255);

};

HealthBar.prototype.setWidth = function(newWidth){
    if(this.flipped) {
        newWidth = -1 * newWidth;
    }
    this.game.add.tween(this.barSprite).to( { width: newWidth }, this.config.animationDuration, Phaser.Easing.Linear.None, true);
};

HealthBar.prototype.setFixedToCamera = function(fixedToCamera) {
    this.bgSprite.fixedToCamera = fixedToCamera;
    this.barSprite.fixedToCamera = fixedToCamera;
};

HealthBar.prototype.kill = function() {
    this.bgSprite.kill();
    this.barSprite.kill();
};

module.exports = HealthBar;



/**
 Utils
 */

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

},{}],15:[function(require,module,exports){
//config.js
'use strict'

var config = {
  tileSize: 16,
  scale: 3.13,
  pixelsPerLifePoint: 15,
  initialPitHealth: 7,
  framesBetweenHit: 60,

  level1initialPos: {x: 170, y: 8780},

  barConfig: {x: 100, y: 50, width: 10, height: 25,
              bg: {color: '#000074'}, bar: {color: '#e20074'}}
}

module.exports = config;

},{}],16:[function(require,module,exports){
//main.js
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

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', level1);

  game.state.start('boot');
};

},{"./Scenes/level1.js":13}]},{},[16]);
