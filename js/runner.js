(function() {
	//essential globals, constants, delta time info//
	const FPS_INTERVAL = 1000/100;
	var globalThen = Date.now();

	//GLOBAL GAME TIMERS//
	var trackUpdate = 0;

	//init game
	const BACKGROUND_COLOR = "#C2995D";
	CURR_LEVEL = 0;
	STAGE_CACHE = levelCloner(CURR_LEVEL);

	function globalStep() {
		const now = Date.now();
		const elapsed = now - globalThen;

		//DELTA TIME//
		if (elapsed > FPS_INTERVAL) {
			globalUpdate();
			globalThen = now - (elapsed % FPS_INTERVAL);
		}
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
			trackUpdate++;

			if (trackUpdate > 6) {
				//ADD TRACK FOR EVERY TANK
				STAGE_CACHE.player.trackUpdate();
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

			//update start logo
			if (startLogoShow) {
				startLogoUpdate();
			}
		}
	}

	function globalRender() {
		//CLEAR CANVAS FOR NEXT FRAME//
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		//RENDER BACKGROUND//
		ctx.fillStyle = BACKGROUND_COLOR;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//RENDER OBJECTS//
		for (var i = 0; i < STAGE_CACHE.tracks.length; i++) {
			STAGE_CACHE.tracks[i].render();
		}

		for (var i = 0; i < STAGE_CACHE.graves.length; i++) {
			STAGE_CACHE.graves[i].render();
		}

		for (var i = 0; i < STAGE_CACHE.shells.length; i++) {
			STAGE_CACHE.shells[i].render();
		}

		for (var i = 0; i < STAGE_CACHE.tiles.length; i++) {
			STAGE_CACHE.tiles[i].render();
		}

		STAGE_CACHE.player.render();

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