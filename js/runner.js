(function() {
	//essential globals and constants//

	//GLOBAL GAME TIMERS//
	var trackUpdate = 0;

	//init game
	const BACKGROUND_COLOR_STRONG = "#C2995D";
	const BACKGROUND_COLOR_WEAK = "#FFDFA8";
	CURR_LEVEL = 0;
	STAGE_CACHE = levelCloner(CURR_LEVEL);

	function globalStep(time) {
		accTime += (time - lastTime) / 1000;

		while (accTime > deltaTime) {
			if (accTime > 1) {
				accTime = deltaTime;
			}

			globalUpdate();
			accTime -= deltaTime;
		}
		lastTime = time;
		globalRender();
		requestAnimationFrame(globalStep);
	}
	requestAnimationFrame(globalStep);

	//RUNNER CENTER//

	function globalUpdate() {
		if (INTERMISSION) {
			intermissionUpdate();
		}

		//set a bit of wait time before beginning the next round or repeating the same round after rendering mission (make sure level doesn't update during intermission)
		if (maskFadeIn) {
			//TRACK MANAGEMENT//
			trackUpdate += deltaTime;

			if (trackUpdate > 0.1) {
				//ADD TRACK FOR EVERY TANK
				STAGE_CACHE.player.trackUpdate();

				for (var i = 0; i < STAGE_CACHE.enemies.length; i++) {
					const enemy = STAGE_CACHE.enemies[i];

					//dont update tracks for tanks that don't move
					if (enemy.tankType == BROWN_TANK)  {
						continue;
					}

					enemy.trackUpdate();
				}
				trackUpdate = 0;
			}

			//UPDATE OBJECTS//
			for (var i = 0; i < STAGE_CACHE.tracks.length; i++) {
				const track = STAGE_CACHE.tracks[i];

				if (track.explode) {
					//DELETE TRACK
					STAGE_CACHE.tracks.splice(i, 1);
					continue
				}

				track.update();
			}

			//update individual block particles for performance sake
			for (var i = 0; i < STAGE_CACHE.tileParticles.length; i++) {
				const tileParticle = STAGE_CACHE.tileParticles[i];

				if (tileParticle.explode) {
					//DELETE PARTICLE
					STAGE_CACHE.tileParticles.splice(i, 1);
					continue;
				}

				tileParticle.update();
			}

			//no need to update blocks. for loop is here to keep track of tile deletion
			for (var i = 0; i < STAGE_CACHE.tiles.length; i++) {
				const tile = STAGE_CACHE.tiles[i];

				if (tile.explode) {
					//DELETE PARTICLE
					STAGE_CACHE.tiles.splice(i, 1);
				}
			}

			for (var i = 0; i < STAGE_CACHE.mines.length; i++) {
				const mine = STAGE_CACHE.mines[i];

				if (mine.explode) {
					//update mine layed for tanks
					if (mine.tankID == PLAYER_ID) {
						STAGE_CACHE.player.mineLayed--;
					}

					//DELETE MINE
					STAGE_CACHE.mines.splice(i, 1);
					continue;
				}

				mine.update();
			}

			for (var i = 0; i < STAGE_CACHE.shells.length; i++) {
				const shell = STAGE_CACHE.shells[i];

				if (shell.explode) {
					//update shells shot for tanks
					if (shell.tankID == PLAYER_ID) {
						STAGE_CACHE.player.shellShot--;
					}

					//DELETE SHELL
					STAGE_CACHE.shells.splice(i, 1);
					continue;
				}

				shell.update();
			}

			STAGE_CACHE.player.update();

			for (var i = 0; i < STAGE_CACHE.enemies.length; i++) {
				STAGE_CACHE.enemies[i].update();
			}

			//update start logo
			if (startLogoShow) {
				startLogoUpdate();
			}
		}
	}

	function globalRender() {
		//CLEAR CANVAS FOR NEXT FRAME//
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		//background gradient
		var grd = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, CANVAS_WIDTH / 2.1, canvas.width / 2, canvas.height / 2, CANVAS_WIDTH);
		grd.addColorStop(0, BACKGROUND_COLOR_STRONG);
		grd.addColorStop(1, BACKGROUND_COLOR_WEAK);

		//RENDER BACKGROUND//
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//RENDER OBJECT SHADOWS//
		for (var i = 0; i < STAGE_CACHE.pits.length; i++) {
			STAGE_CACHE.pits[i].renderShadow();
		}

		for (var i = 0; i < STAGE_CACHE.shells.length; i++) {
			STAGE_CACHE.shells[i].renderShadow();
		}

		for (var i = 0; i < STAGE_CACHE.mines.length; i++) {
			STAGE_CACHE.mines[i].renderShadow();
		}
		
		STAGE_CACHE.player.renderShadow();

		for (var i = 0; i < STAGE_CACHE.enemies.length; i++) {
			STAGE_CACHE.enemies[i].renderShadow();
		}

		for (var i = 0; i < STAGE_CACHE.tiles.length; i++) {
			STAGE_CACHE.tiles[i].renderShadow();
		}

		//RENDER OBJECTS//
		for (var i = 0; i < STAGE_CACHE.tracks.length; i++) {
			STAGE_CACHE.tracks[i].render();
		}

		for (var i = 0; i < STAGE_CACHE.graves.length; i++) {
			STAGE_CACHE.graves[i].render();
		}

		//render individual block particles for performance sake
		for (var i = 0; i < STAGE_CACHE.pits.length; i++) {
			STAGE_CACHE.pits[i].render();
		}
		
		for (var i = 0; i < STAGE_CACHE.tileParticles.length; i++) {
			STAGE_CACHE.tileParticles[i].render();
		}

		for (var i = 0; i < STAGE_CACHE.shells.length; i++) {
			STAGE_CACHE.shells[i].render();
		}

		for (var i = 0; i < STAGE_CACHE.mines.length; i++) {
			STAGE_CACHE.mines[i].render();
		}

		STAGE_CACHE.player.render();

		for (var i = 0; i < STAGE_CACHE.enemies.length; i++) {
			STAGE_CACHE.enemies[i].render();
		}

		for (var i = 0; i < STAGE_CACHE.tiles.length; i++) {
			STAGE_CACHE.tiles[i].render();
		}

		//render intermission
		if (INTERMISSION) {
			intermissionRender();
		}

		//render start logo
		if (startLogoShow) {
			startLogoRender();
		}
	}

	//KEYBOARD & MOUSE EVENTS//
	canvas.addEventListener("mousedown", e => {
		updateMousePos(e.clientX, e.clientY);
		STAGE_CACHE.player.shoot();
	})

	canvas.addEventListener("mousemove", e => {
		updateMousePos(e.clientX, e.clientY);
	});

	window.addEventListener("keydown", e => {
		STAGE_CACHE.player.keys[e.keyCode || e.which] = true;
	});

	window.addEventListener("keyup", e => {
		delete STAGE_CACHE.player.keys[e.keyCode || e.which];
	});

	window.onblur = function(){
		STAGE_CACHE.player.keys = {};
	};
})();