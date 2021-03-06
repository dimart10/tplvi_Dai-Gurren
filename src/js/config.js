//config.js
'use strict'

var config = {
  //WORLD
  tileSize: 16,
  scale: 3.13,
  scale2: 2.5, //Special scale for some enemies
  maxVelocity: 800, //To avoid tunneling

  //PIT
  initialPitHealth: 10,
  framesBetweenHit: 60,
  jumpTime: 11,
  initialDirection: 1,
  initialState: "normal",
  deadScreenTime: 200,
  teleportX: 1640,
  crouchFall: 4,

  movementSpeed: 215,

  normalW: 8,
  normalH: 24,
  normalOX: 9, //Normal body X offset
  normalOY: 0,
  crouchW: 13,
  crouchH: 13,
  crouchOX: 1,
  crouchOY: 7,

  shootKey: Phaser.Keyboard.A,
  jumpKey: Phaser.Keyboard.SPACEBAR,
  menuSelectKey: Phaser.Keyboard.ENTER,
  exitKey: Phaser.Keyboard.ESC,

  level1initialPos: {x: 170, y: 8780},
  level2initialPos: {x: 170, y: 10280},
  level3initialPos: {x: 170, y: 14800},
  level1endLevelPos: {x: 780, y: 500},
  level2endLevelPos: {x: 780, y: 500},
  level3endLevelPos: {x: 780, y: 500},
  bossLevelinitialPos: {x: 170, y: 415},

  level1colisionBlockID: 5761,
  level1edgesBlockID: 5762,
  level1platformsBlockID: 5764,
  level1hazardBlockID: 5766,

  level2colisionBlockID: 6721,
  level2edgesBlockID: 6722,
  level2platformsBlockID: 6724,
  level2hazardBlockID: 6726,

  level3colisionBlockID: 9601,
  level3edgesBlockID: 9602,
  level3platformsBlockID: 9604,
  level3hazardBlockID: 9606,

  bossLevelcolisionBlockID: 1,
  bossLevelplatformsBlockID: 4,

  //ENEMIES
    //Mcgoo
  mcgooW: 12,
  mcgooH: 20,
  mcgooOX: 5,
  mcgooOY: 0,
  mcgooMaxHealth: 1,
  mcgooHeartValue: 5,
  mcgooAttackDamage: 1,
  mcgooTimeBeetweenAttacks: 100,
  mcgooAimTime: 40,
  mcgooHiddenW: 12,
  mcgooHiddenH: 5,
  mcgooHiddenOX: 5,
  mcgooHiddenOY: 10,
  mcgooDetectionRange: 50,

    //Monoeye
  monoeyeVelocity: 3,
  monoeyeRadius: 300,
  monoeyeW: 20,
  monoeyeH: 20,
  monoeyeOX: 5,
  monoeyeOY: 0,
  monoeyeMaxHealth: 1,
  monoeyeHeartValue: 5,
  monoeyeAttackDamage: 1,

    //Nettler
  nettlerW: 12,
  nettlerH: 12,
  nettlerOX: 8,
  nettlerOY: 8,
  nettlerMaxHealth: 1,
  nettlerVelocity: 75,
  nettlerAttackDamage: 1,
  nettlerHeartValue: 5,
  nettlerCrouchTime: 8,
  nettlerCrouchW: 12,
  nettlerCrouchH: 6,
  nettlerCrouchOX: 8,
  nettlerCrouchOY: 10,
  nettlerRangeDetection: 20,

    //Reaper
  reaperVelocity: 50,
  reaperW: 15,
  reaperH: 24,
  reaperOX: 5,
  reaperOY: -1,
  reaperMaxHealth: 10,
  reaperAttackDamage: 2,
  reaperHeartValue: 10,
  reaperDetectionRange: 20,
  reaperTurnTime: 100,
  reaperTimeToTurn: 300,
  reaperVelocityMultiplier: 3,

    //Reappete
  reapetteVelocity: 3,
  reapetteRadius: 300,
  reapetteW: 10,
  reapetteH: 20,
  reapetteOX: 5,
  reapetteOY: 0,
  reapetteMaxHealth: 1,
  reapetteAttackDamage: 1,
  reapetteHeartValue: 1,

    //Shemum
  shemumVelocity: 150,
  shemumW: 10,
  shemumH: 15,
  shemumOX: 10,
  shemumOY: 4,
  shemumMaxHealth: 1,
  shemumAttackDamage: 1,
  shemumHeartValue: 1,

    //Twin bellows
  twinbellowsW: 30,
  twinbellowsH: 24,
  twinbellowsOX: 0,
  twinbellowsOH: 0,
  twinbellowsMaxHealth: 30,
  twinbellowsAttackDamage: 2,
  twinbellowsVelocity: 70,
  twinbellowsAttackTime: 100,
  twinbellowsJumpTime: 220,
  twinbellowsJumpHeight: -900,
  twinbellowsDirectionTimeRight: 150,
  twinbellowsDirectionTimeLeft: 40,

  //SCENARY
  maxBottles: 8,

    //Arrow
  arrowAttackDamage: 1,
  arrowDistance: 220,
  arrowVelocity: 900,

    //Barrel

    //Bottle

    //Chalice
  chacliceHealing: 7,

    //Heart
  heartTime: 300,

    //Angel Feather
  angelFeatherHealth: 2,
    //Level end

    //Magma shot
  magmaShotAttackDamage: 2,
  magmaShotOffset: 10,
  magmaShotDistance: 300,
  magmaShotVelocity: 400,

  //moving platforms
  movingPlatformVelocity: 150,

  //hazards
  hazardAttack: 1,

    //HUD VARIABLES
  barConfig: {x: 50, y: 50, width: 10, height: 25,
              bg: {color: '#000074'}, bar: {color: '#e20074'}},
  pixelsPerLifePoint: 15,

  heartText: {x: 85, y: 25, startValue: 0,
            color: '#ffffff', font: '24px Consolas',
            strokeColor:'#0157dc', strokeThickness: 5},
  heartHUD: {x: 50, y: 0, scale: 2.8},

}

module.exports = config;
