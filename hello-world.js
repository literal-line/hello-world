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
		aa: false
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
		canvas.imageRendering = info.aa ? 'auto' : 'pixelated';
		canvas.imageRendering = info.aa ? 'auto' : '-moz-crisp-edges';
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

	var game = (function () {
		var levels = {
			'lol': {
				width: 25,
				height: 5,
				tileData: [
					'0000002000000000000000000',
					'0000002000000000000000000',
					'0000002000000000000000000',
					'1222222222222222222222223',
					'6777777777777777777777778'
				],
				itemData: [
					'',
					'',
					''
				],
			}
		};

		var playLevel = (function (lvlList) {
			var lvlCanvas = document.createElement('canvas');
			var lvlStage = lvlCanvas.getContext('2d');
			var playerCanvas = document.createElement('canvas');
			var playerStage = playerCanvas.getContext('2d');
			var lastLvl;
			var camX = 0;
			var camY = 0;
			var camZoom = 3;
			var playerX = 0;
			var playerY = 0;

			var controls = function (lvl, obj) {
				var tileCollision;
				var updateTileCollision = function () {
					tileCollision = parseInt(lvlList[lvl].tileData[Math.floor(playerY / 64)].charAt(Math.floor(playerX / 64)));
				};
				var whileTile = function (callback) {
					while (tileCollision) {
						updateTileCollision();
						callback();
					}
				};
				updateTileCollision();
				stage.drawText({ text: tileCollision, x: 50, y: 50 });
				if (keys[obj.up] && !keys[obj.down]) {
					playerY -= ms / 5;
					whileTile(function() { playerY += 1; });
				}
				if (keys[obj.down] && !keys[obj.up]) {
					playerY += ms / 5;
					whileTile(function() { playerY -= 1; });
				}
				if (keys[obj.right] && !keys[obj.left]) {
					playerX += ms / 5;
					whileTile(function() { playerX -= 1; });
				}
				if (keys[obj.left] && !keys[obj.right]) {
					playerX -= ms / 5;
					whileTile(function() { playerX += 1; });
				}
			};

			var renderLvl = function (lvl) {
				var lvl = lvlList[lvl];
				lvlCanvas.width = playerCanvas.width = lvl.width * 64;
				lvlCanvas.height = playerCanvas.height = lvl.height * 64;
				for (var y = 0; y < lvl.height; y++) {
					for (var x = 0; x < lvl.width; x++) {
						var curTile = parseInt(lvl.tileData[y].charAt(x)) * 64;
						//var curItem = parseInt(lvl.itemData[y].charAt(x)) * 16;
						lvlStage.drawImage(sprites.tiles, curTile, 0, 64, 64, x * 64, y * 64, 64, 64);
						//lvlStage.drawImage(sprites.items, curItem, 0, 16, 16, x * 16, y * 16, 16, 16);
					}
				}
				document.body.appendChild(lvlCanvas)
				document.body.appendChild(playerCanvas)
			};

			return function (lvl) {
				if (lvl !== lastLvl) { renderLvl(lvl); lastLvl = lvl; }
				playerStage.clearRect(playerX - 32, playerY - 32, 64, 64);
				controls(lvl, { up: 'KeyW', down: 'KeyS', right: 'KeyD', left: 'KeyA' });
				playerStage.fillRect(playerX - 16, playerY - 16, 32, 32);
			}
		})(levels);

		var lastDelta = 0;
		var fps;
		var ms;
		return {
			loop: function (delta) {
				stage.clearRect(0, 0, info.width, info.height);
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
