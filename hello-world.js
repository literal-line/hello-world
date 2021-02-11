var HELLO_WORLD = (function () {
	var canvas = document.createElement('canvas');
	var stage = canvas.getContext('2d');
	var info = {
		version: '',
		authors: 'Literal Line',
		width: 1024, // placeholder
		height: 576, // placeholder
		widthCSS: '1024px', // placeholder
		heightCSS: '576px', // placeholder
		bg: '#FFFFFF',
		aa: true
	};

	var keys = {};

	var initEventListeners = function () {
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
		canvas.style.imageRendering = info.aa ? 'auto' : 'pixelated';
		canvas.style.imageRendering = info.aa ? 'auto' : '-moz-crisp-edges';
		stage.imageSmoothingEnabled = info.aa;
	};

	var init = function () {
		initEventListeners();
		initCanvas();
	};

	var assets = {
		spriteTiles: './assets/tiles.png'
	};

	var sprites = {
		tiles: newImage(assets.spriteTiles)
	};

	CanvasRenderingContext2D.prototype.drawText = function (obj) { // more uniform way of drawing text
		this.fillStyle = obj.color || '#000000';
		this.strokeStyle = obj.outlineColor || '#000000';
		this.lineWidth = obj.outlineWidth || 2;
		this.font = (obj.size || 24) + 'px sans-serif';
		if (obj.outline) this.strokeText(obj.text, obj.center ? obj.x - this.measureText(obj.text).width / 2 : obj.x, obj.y);
		this.fillText(obj.text, obj.center ? obj.x - this.measureText(obj.text).width / 2 : obj.x, obj.y);
  };

  var GameEntity = function (x, y) {
    this.x = x;
    this.y = y;
    this.velX = 0;
    this.velY = 0;
    this.w = 32;
    this.h = 32;
    this.moveSpeed = 10;
    this.jumpVel = 10;
    this.gravity = 10;
  };

	var game = (function () {
		var levels = {
			'lol': {
        startX: 816,
        startY: 128,
				width: 26,
				height: 26,
				tileData: [
          '0777777777777777777777770',
          '5777777777777777777777774',
          '5777777777780067777777774',
          '5777777777780067777777774',
          '5777777777780067777777774',
          '5777777777780067777777774',
          '5777777777780067777777774',
          '5777777777780067777777774',
          '5777777777780067777777774',
          '5777777777780067777777774',
          '5777777777780067777777774',
          '5777777777780067777777774',
          '5777777777780067777777774',
          '5777777777780067777777774',
          '5777777777780067777777774',
          '5777777777780067777777774',
          '5777777777780067777777774',
          '5777777777780067777777774',
          '5777777777780067777777774',
          '5777777777780067777777774',
          '5777777777780067777777774',
          '5777777777780067777777774',
          '5000000000000000000000004',
          '5000000000000000000000004',
          '5000000000000000000000004',
          '0222222222222222222222220'
				],
				itemData: [ /* bruh */ ],
			}
		};

		var playLevel = (function (lvlList) {
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
      var player = new GameEntity(0, 0);
      
      var setPosition = function (x, y) {
        player = new GameEntity(x, y);
        cam.x = x,
        cam.y = y;
      };

			var pControls = function (obj) {
				if (keys[obj.right]) player.velX += player.moveSpeed / ms;
        if (keys[obj.left]) player.velX -= player.moveSpeed / ms;
        player.velX *= 0.9;
        player.x += player.velX;
        tiles.forEach(function(cur) {
          if (collision(player, cur)) {
            done = true;
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
        player.velY += player.gravity / (!ms ? player.gravity : ms);
        player.y += player.velY;
        tiles.forEach(function(cur) {
          if (collision(player, cur)) {
            player.y += player.velY * -1;
            player.velY = 0;
          }
        });
        player.y += 2;
        tiles.forEach(function(cur) {
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
        cam.x += (player.x + 16 - cam.x) * (ms / 150);
        cam.y += (player.y + 16 - cam.y) * (ms / 150);
        stage.drawText({ text: '➖ ➕', x: canvas.width - 84, y: canvas.height - 24 });
      };

			var renderLvl = function (lvl) {
        var lvl = lvlList[lvl];
        tiles = [];
				lvlCanvas.width = playerCanvas.width = lvl.width * 64;
				lvlCanvas.height = playerCanvas.height = lvl.height * 64;
				for (var y = 0; y < lvl.height; y++) {
					for (var x = 0; x < lvl.width; x++) {
            var curTile = parseInt(lvl.tileData[y].charAt(x)) * 64;
            if (curTile) tiles.push({ x: x * 64, y: y * 64, w: 64, h: 64 });
						lvlStage.drawImage(sprites.tiles, curTile, 0, 64, 64, x * 64, y * 64, 64, 64);
					}
        }
      };
      
      var pRender = function () {
        playerStage.fillRect(player.x, player.y, 32, 32);
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
        doCamera({ zoomIn: 'Equal', zoomOut: 'Minus' });
        cRender();
			}
		})(levels);

		var lastDelta = 0;
		var fps = 0;
		var ms = 0;
		return {
			loop: function (delta) {
				stage.clearRect(0, 0, canvas.width, canvas.height);
				ms = delta - lastDelta < 100 ? delta - lastDelta : 0;
				fps = (1000 / ms);

				playLevel('lol');

				stage.drawText({ text: 'FPS: ' + Math.floor(fps), color: 'rgba(0, 0, 0, 0.75)', x: 0, y: 24 });
				lastDelta = delta;
				requestAnimationFrame(game.loop);
			}
		}
	})();

	return {
		go: function () {
			init();
			document.body.insertAdjacentElement('afterbegin', canvas);
			requestAnimationFrame(game.loop);
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
