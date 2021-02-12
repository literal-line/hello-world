// hello-world by Literal Line
// more at quique.gq

var HELLO_WORLD = (function () {
  'use strict';


  var canvas = document.createElement('canvas');
  var stage = canvas.getContext('2d');
  var info = {
    version: 'v0.1-20210212-1825est',
    authors: 'Literal Line',
    width: window.innerWidth, // placeholder
    height: window.innerHeight, // placeholder
    widthCSS: window.innerWidth + 'px', // placeholder
    heightCSS: window.innerHeight + 'px', // placeholder
    bg: '#FFFFFF',
    aa: false
  };

  var keys = {};

  var initEventListeners = function () {
    addEventListener('resize', function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      stage.imageSmoothingEnabled = info.aa;
    });
    addEventListener('keydown', function (e) {
      keys[e.code] = true;
    });
    addEventListener('keyup', function (e) {
      delete keys[e.code];
    });
    addEventListener('blur', function () {
      keys = {};
    });
  };

  var initCanvas = function () {
    canvas.width = info.width;
    canvas.height = info.height;
    canvas.style.width = info.widthCSS;
    canvas.style.height = info.heightCSS;
    canvas.style.background = info.bg;
    canvas.style.display = 'block';
    canvas.style.margin = 'auto';
    canvas.style.position = 'absolute';
    canvas.style.imageRendering = info.aa ? 'auto' : 'pixelated';
    canvas.style.imageRendering = info.aa ? 'auto' : '-moz-crisp-edges';
    stage.imageSmoothingEnabled = info.aa;
  };

  var init = function () {
    initEventListeners();
    initCanvas();
    console.log('hello-world');
    console.log('by ' + info.authors);
  };

  var ctb = function () {
    var button = document.createElement('button');
    button.onclick = function () {
      go();
      button.remove();
    };
    button.style = 'padding: 10px; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: "Courier New"; font-size: 2vw';
    button.innerHTML = 'Click to begin';
    document.body.insertAdjacentElement('afterbegin', button);
  };

  var go = function () {
    document.body.insertAdjacentElement('afterbegin', canvas);
    requestAnimationFrame(game.loop);
    audio.bgm.volume = 0.5;
    audio.bgm.play();
  };

  var assets = {
    spriteTilesDefault: './assets/tilesDefault.png',
    spriteTilesGrass: './assets/tilesGrass.png',
    spriteSpunchBob: './assets/spunch bob.jpg',
    spriteBgOcean: './assets/ocean.jpg',
    audioBgm: './assets/Koukyoukyoku \'Douran\' Dai\'ni Gakushou Yori.mp3'
  };

  var sprites = {
    tilesDefault: newImage(assets.spriteTilesDefault),
    tilesGrass: newImage(assets.spriteTilesGrass),
    spunchBob: newImage(assets.spriteSpunchBob)
  };

  var audio = {
    bgm: new Audio(assets.audioBgm)
  };

  CanvasRenderingContext2D.prototype.drawText = function (obj) { // more uniform way of drawing text
    this.fillStyle = obj.color || '#000000';
    this.strokeStyle = obj.outlineColor || '#000000';
    this.lineWidth = obj.outlineWidth || 2;
    this.font = (obj.size || 24) + 'px Courier New';
    if (obj.outline) this.strokeText(obj.text, obj.center ? obj.x - this.measureText(obj.text).width / 2 : obj.x, obj.y);
    this.fillText(obj.text, obj.center ? obj.x - this.measureText(obj.text).width / 2 : obj.x, obj.y);
  };

  var GameEntity = function (obj) {
    this.x = obj.x || 0;
    this.y = obj.y || 0;
    this.velX = 0;
    this.velY = 0;
    this.w = obj.w || 32;
    this.h = obj.h || 32;
    this.moveSpeed = obj.moveSpeed || 10;
    this.jumpVel = obj.jumpVel || 15;
    this.gravity = obj.gravity || 1;
    this.texture = obj.texture || false;
  };

  var game = (function () {
    var tilesets = {
      default: sprites.tilesDefault,
      grass: sprites.tilesGrass
    };

    var levels = {
      'test': {
        startX: 752,
        startY: 128,
        width: 24,
        height: 12,
        bg: 'url(' + assets.spriteBgOcean + ') no-repeat',
        tileset: 'default',
        tileData: [
          'k7777777777777777777777l',
          '500000000000000000000004',
          '500000000000000000000004',
          '500000000000000000000004',
          '500000000000000000000004',
          '500000000000000000000004',
          '500000000000000000000004',
          '5000000000000000000000e4',
          '5000000000000000000b0004',
          '50000000000000001e99d004',
          '500000000000000167800014',
          'm2222222222222222222222n'
        ],
        itemData: [ /* bruh */],
      }
    };

    var playLevel = (function (tilesetList, lvlList) {
      var lvlCanvas = document.createElement('canvas');
      var lvlStage = lvlCanvas.getContext('2d');
      var playerCanvas = document.createElement('canvas');
      var playerStage = playerCanvas.getContext('2d');
      var lastLvl;
      var cam = {
        x: 0,
        y: 0,
        zoom: 2
      };
      var tiles;
      var player;

      var setPosition = function (x, y) {
        player = new GameEntity({
          x: x,
          y: y,
          w: 48,
          h: 48,
          texture: sprites.spunchBob
        });
        cam.x = x,
          cam.y = y;
      };

      var pControls = function (obj) {
        if (keys[obj.right]) player.velX += ms / player.moveSpeed;
        if (keys[obj.left]) player.velX -= ms / player.moveSpeed;
        player.velX *= 0.9;
        player.x += player.velX;
        tiles.forEach(function (cur) {
          if (collision(player, cur)) {
            player.y--;
            if (collision(player, cur)) {
              player.y--;
              if (collision(player, cur)) {
                player.y--;
                if (collision(player, cur)) {
                  player.y--;
                  if (collision(player, cur)) {
                    player.y--;
                    if (collision(player, cur)) {
                      player.x += player.velX * -1;
                      player.y += 5;
                      player.velX = 0;
                    }
                  }
                }
              }
            }
          }
        });
        player.velY += player.gravity;
        player.y += player.velY;
        tiles.forEach(function (cur) {
          if (collision(player, cur)) {
            player.y += player.velY * -1;
            player.velY = 0;
          }
        });
        player.y += 2;
        tiles.forEach(function (cur) {
          if (collision(player, cur)) {
            if (keys[obj.up]) player.velY = -player.jumpVel;
          }
        });
        player.y--;
      };

      var cControls = function (obj) {
        if (keys[obj.zoomIn]) cam.zoom += ms / 500;
        if (keys[obj.zoomOut]) cam.zoom -= ms / 500;
        if (cam.zoom < 0.5) cam.zoom = 0.5;
        if (cam.zoom > 5) cam.zoom = 5;
      };

      var collision = function (rect1, rect2) {
        return (rect1.x < rect2.x + rect2.w && rect1.x + rect1.w > rect2.x && rect1.y < rect2.y + rect2.h && rect1.y + rect1.h > rect2.y)
      };

      var doCamera = function (obj) {
        cControls(obj);
        cam.x += (player.x + Math.round(player.w / 2) - cam.x) * (ms / 150);
        cam.y += (player.y + Math.round(player.h / 2) - cam.y) * (ms / 150);
        stage.drawText({ text: 'Move: WASD', color: 'rgba(255, 255, 255, 0.75)', x: 20, y: canvas.height - 24 });
        stage.drawText({ text: 'Camera: ➖ ➕', color: 'rgba(255, 255, 255, 0.75)', x: canvas.width - 202, y: canvas.height - 24 });
      };

      var renderLvl = function (lvl) {
        var lvl = lvlList[lvl];
        var tileset = tilesetList[lvl.tileset];
        tiles = [];
        lvlCanvas.width = playerCanvas.width = lvl.width * 64;
        lvlCanvas.height = playerCanvas.height = lvl.height * 64;
        canvas.style.background = lvl.bg;
        for (var y = 0; y < lvl.height; y++) {
          for (var x = 0; x < lvl.width; x++) {
            var curTile = parseInt(lvl.tileData[y].charAt(x), 36) * 64;
            if (curTile) tiles.push({ x: x * 64, y: y * 64, w: 64, h: 64 });
            lvlStage.drawImage(tileset, curTile, 0, 64, 64, x * 64, y * 64, 64, 64);
          }
        }
      };

      var pRender = function () {
        var x = Math.round(player.x);
        var y = Math.round(player.y);
        var w = player.w;
        var h = player.h;
        if (player.texture) playerStage.drawImage(player.texture, x, y, w, h); else playerStage.fillRect(x, y, w, h);
      };

      var cRender = function () {
        var x = canvas.width / 2 - cam.x * cam.zoom;
        var y = canvas.height / 2 - cam.y * cam.zoom;
        var zoomX = lvlCanvas.width * cam.zoom;
        var zoomY = lvlCanvas.height * cam.zoom;
        stage.drawImage(lvlCanvas, x, y, zoomX, zoomY);
        stage.drawImage(playerCanvas, x, y, zoomX, zoomY);
      };

      return function (lvl) {
        playerStage.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
        if (lvl !== lastLvl) {
          renderLvl(lvl);
          lastLvl = lvl;
          setPosition(lvlList[lvl].startX, lvlList[lvl].startY);
        }
        pControls({ up: 'KeyW', down: 'KeyS', right: 'KeyD', left: 'KeyA' });
        pRender();
        cRender();
        doCamera({ zoomIn: 'Equal', zoomOut: 'Minus' });
      }
    })(tilesets, levels);

    var lastDelta = 0;
    var fps = 0;
    var ms = 0;
    return {
      loop: function (delta) {
        stage.clearRect(0, 0, canvas.width, canvas.height);
        ms = delta - lastDelta < 100 ? delta - lastDelta : 1;
        fps = (1000 / ms);

        playLevel('test');

        stage.drawText({ text: 'FPS: ' + Math.floor(fps), color: 'rgba(255, 255, 255, 0.75)', x: 0, y: 24 });
        lastDelta = delta;
        requestAnimationFrame(game.loop);
      }
    }
  })();

  return {
    init: function () {
      init();
      ctb();
    }
  }
})();

function newImage(src) {
  var img = document.createElement('img');
  img.src = src;
  return img;
}

function convertBase(value, from_base, to_base) { // i know you can convert base 36 to 10 and whatever without this but i like it so im gonna use it
  var range = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('');
  var from_range = range.slice(0, from_base);
  var to_range = range.slice(0, to_base);

  var dec_value = value.split('').reverse().reduce(function (carry, digit, index) {
    if (from_range.indexOf(digit) === -1) throw new Error('Invalid digit `' + digit + '` for base ' + from_base + '.');
    return carry += from_range.indexOf(digit) * (Math.pow(from_base, index));
  }, 0);

  var new_value = '';
  while (dec_value > 0) {
    new_value = to_range[dec_value % to_base] + new_value;
    dec_value = (dec_value - (dec_value % to_base)) / to_base;
  }
  return new_value || '0';
}
