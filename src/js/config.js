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
