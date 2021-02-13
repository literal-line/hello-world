// hello-world by Literal Line
// more at quique.gq

var HELLO_WORLD = function () {
  'use strict';


  var canvas = document.createElement('canvas');
  var stage = canvas.getContext('2d');
  var info = {
    version: 'v0.1-20210213-0053est',
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
    canvas.style.backgroundSize = '100% 100%';
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
    spritePatrice: './assets/patrice.png',
    spriteBgOcean: './assets/ocean.jpg',
    audioBgm: './assets/Koukyoukyoku \'Douran\' Dai\'ni Gakushou Yori.mp3'
  };

  var sprites = {
    tilesDefault: newImage(assets.spriteTilesDefault),
    tilesGrass: newImage(assets.spriteTilesGrass),
    spunchBob: newImage(assets.spriteSpunchBob),
    patrice: newImage(assets.spritePatrice)
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

  var collision = function (rect1, rect2) {
    return (rect1.x < rect2.x + rect2.w && rect1.x + rect1.w > rect2.x && rect1.y < rect2.y + rect2.h && rect1.y + rect1.h > rect2.y)
  };

  var GameEntity = function (obj) {
    this.x = obj.x || 0;
    this.y = obj.y || 0;
    this.velX = 0;
    this.velY = 0;
    this.w = obj.w || 32;
    this.h = obj.h || 32;
    this.moveSpeed = obj.moveSpeed || 0.5;
    this.jumpVel = obj.jumpVel || 15;
    this.gravity = obj.gravity || 1;
    this.texture = obj.texture || false;
    this.direction = obj.direction || 'right';
    this.controls = obj.controls || { up: false, down: false, right: false, left: false };
  };

  GameEntity.prototype.physics = function (tiles, timeStep) {
    var self = this;
    if (self.controls.right) { self.direction = 'right'; self.velX += self.moveSpeed; }
    if (self.controls.left) { self.direction = 'left'; self.velX -= self.moveSpeed; }
    self.velX *= 0.9;
    self.x += self.velX * timeStep;
    tiles.forEach(function (cur) {
      if (collision(self, cur)) {
        var col = 0;
        while (collision(self, cur)) {
          self.y--;
          col++
        }
        if (col > 10) {
          self.x += self.velX * timeStep * -1;
          self.y += col;
          self.velX = 0;
        }
      }
    });
    self.velY += self.gravity * timeStep;
    self.y += self.velY * timeStep;
    tiles.forEach(function (cur) {
      if (collision(self, cur)) {
        self.y += self.velY * timeStep * -1;
        self.velY = 0;
      }
    });
    self.y += 2;
    tiles.forEach(function (cur) {
      if (collision(self, cur)) {
        if (self.controls.up) self.velY = -self.jumpVel;
      }
    });
    self.y--;
  };

  GameEntity.prototype.render = function (stage) {
    var x = Math.round(this.x);
    var y = Math.round(this.y);
    var w = this.w;
    var h = this.h;
    var t = this.texture;
    var d = this.direction;
    if (t) {
      if (d === 'right') {
        stage.drawImage(t, x, y, w, h);
      } else if (d === 'left') {
        stage.drawImage(t.flipped, x, y, w, h);
      }
    } else {
      stage.fillStyle = '#000000';
      stage.fillRect(x, y, w, h);
    }
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
        bg: 'url(' + assets.spriteBgOcean + ')',
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
          '500000000000000140500014',
          'm2222222222222222222222n'
        ],
        itemData: [ /* bruh */],
        entityData: [
          new GameEntity({ x: 272, y: 311, texture: sprites.patrice })
        ]
      }
    };

    var playLevel = (function (tilesetList, lvlList) {
      var lvlCanvas = document.createElement('canvas');
      var lvlStage = lvlCanvas.getContext('2d');
      var entityCanvas = document.createElement('canvas');
      var entityStage = entityCanvas.getContext('2d');
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
        cam.x = x;
        cam.y = y;
      };

      var cControls = function (obj) {
        if (keys[obj.zoomIn]) cam.zoom += (1 / 30) * cam.zoom * timeStep;
        if (keys[obj.zoomOut]) cam.zoom -= (1 / 30) * cam.zoom * timeStep;
        if (cam.zoom < 0.5) cam.zoom = 0.5;
        if (cam.zoom > 5) cam.zoom = 5;
      };

      var doCamera = function (obj) {
        cControls(obj);
        cam.x += (player.x + Math.round(player.w / 2) - cam.x) * 0.1 * timeStep;
        cam.y += (player.y + Math.round(player.h / 2) - cam.y) * 0.1 * timeStep;
        stage.drawText({ text: 'Move: WASD', color: 'rgba(255, 255, 255, 0.75)', x: 20, y: canvas.height - 24 });
        stage.drawText({ text: 'Camera: ➖ ➕', color: 'rgba(255, 255, 255, 0.75)', x: canvas.width - 202, y: canvas.height - 24 });
      };

      var renderLvl = function (lvl) {
        var lvl = lvlList[lvl];
        var tileset = tilesetList[lvl.tileset];
        tiles = [];
        lvlCanvas.width = entityCanvas.width = lvl.width * 64;
        lvlCanvas.height = entityCanvas.height = lvl.height * 64;
        canvas.style.background = lvl.bg;
        for (var y = 0; y < lvl.height; y++) {
          for (var x = 0; x < lvl.width; x++) {
            var curTile = parseInt(lvl.tileData[y].charAt(x), 36) * 64;
            if (curTile) tiles.push({ x: x * 64, y: y * 64, w: 64, h: 64 });
            lvlStage.drawImage(tileset, curTile, 0, 64, 64, x * 64, y * 64, 64, 64);
          }
        }
      };

      var cRender = function () {
        var x = canvas.width / 2 - cam.x * cam.zoom;
        var y = canvas.height / 2 - cam.y * cam.zoom;
        var zoomX = lvlCanvas.width * cam.zoom;
        var zoomY = lvlCanvas.height * cam.zoom;
        stage.drawImage(lvlCanvas, x, y, zoomX, zoomY);
        stage.drawImage(entityCanvas, x, y, zoomX, zoomY);
      };

      var doEntities = function (lvl) {
        lvlList[lvl].entityData.forEach(function (cur) {
          if (!(timer % 10)) {
            cur.controls = { up: rndInt(2), down: rndInt(2), right: rndInt(2), left: rndInt(2) };
          }
          cur.physics(tiles, timeStep);
          cur.render(entityStage);
        });
      };

      return function (lvl) {
        entityStage.clearRect(0, 0, entityCanvas.width, entityCanvas.height);
        if (lvl !== lastLvl) {
          renderLvl(lvl);
          lastLvl = lvl;
          setPosition(lvlList[lvl].startX, lvlList[lvl].startY);
        }
        player.controls = { up: keys['KeyW'], down: keys['KeyS'], right: keys['KeyD'], left: keys['KeyA'] };
        player.physics(tiles, timeStep);
        player.render(entityStage);
        doEntities(lvl);
        cRender();
        doCamera({ zoomIn: 'Equal', zoomOut: 'Minus' });
      }
    })(tilesets, levels);

    var lastDelta = 0;
    var fps = 0;
    var ms = 0;
    var timeStep = 1;
    var timer = 0;
    var lastTimer;

    setInterval(function () {
      timer++;
    }, 100);

    init();
    ctb();

    return {
      loop: function (delta) {
        stage.clearRect(0, 0, canvas.width, canvas.height);
        ms = delta - lastDelta < 100 ? delta - lastDelta : (1000 / 60);
        fps = (1000 / ms);
        timeStep = 2;
        timeStep = ms / (1000 / 60);

        playLevel('test');

        stage.drawText({ text: 'FPS: ' + Math.floor(fps), color: 'rgba(255, 255, 255, 0.75)', x: 0, y: 24 });
        lastDelta = delta;
        requestAnimationFrame(game.loop);
      }
    }
  })();
};

function rndInt(max) {
  return Math.floor(Math.random() * max);
}

function newImage(src) {
  var img = document.createElement('img');
  img.src = src;
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.scale(-1, 1);
  ctx.translate(-img.width, 0);
  ctx.drawImage(img, 0, 0);
  img.flipped = canvas;
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
