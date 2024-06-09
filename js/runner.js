(function() {
	//essential globals and constants//
	const uploadDisplay = document.getElementById("upload-display");
	const importButton = document.getElementById("upload");

	//GLOBAL GAME TIMERS//
	var trackUpdate = 0;

	//init game
	const BACKGROUND_COLOR_STRONG = "#C2995D";
	const BACKGROUND_COLOR_WEAK = "#FFDFA8";
	CURR_LEVEL = 0;

	if (!intro) {
		STAGE_CACHE = levelCloner(CURR_LEVEL);
	}

	//pause button
	const pauseButton = new PauseButton();

	function mouseOnPause() {
		if ((pauseButton.x <= MOUSE_POS.x && MOUSE_POS.x <= pauseButton.x + pauseButton.side) && (pauseButton.y <= MOUSE_POS.y && MOUSE_POS.y <= pauseButton.y + pauseButton.side)) {
			return true;
		}
		return false;
	}

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
		//if the game isn't paused
		if (!gamePaused) {
			if (INTERMISSION) {
				intermissionUpdate();
			}

			//if it is intro, update intro
			if (intro) {
				introUpdate();
			} else {
				//set a bit of wait time before beginning the next round or repeating the same round after rendering mission (make sure level doesn't update during intermission)
				if (maskFadeIn) {
					//LOBBY PORTALS//
					if (CURR_LEVEL == 0) {
						playPortal.update();

						//only make challenge portal sparkle if player has beaten normal campaign
						if (localStorage.getItem("beaten-game") == "true") {
							challengePortal.update();

							if (challengePortal.isTouched()) {
								//teleport to challenge campaign
								CURR_CAMPAIGN = CHALLENGE_CAMPAIGN;

								//move player outside of the stage
								STAGE_CACHE.player.x = 5000;
								STAGE_CACHE.player.y = 5000;							
							}
						}

						//only make portal sparkle if custom level is loaded in
						if (CUSTOM_LEVEL[1]) {
							customPortal.update();

							if (customPortal.isTouched()) {
								//teleport to custom campaign
								CURR_CAMPAIGN = CUSTOM_CAMPAIGN;

								//move player outside of the stage
								STAGE_CACHE.player.x = 5000;
								STAGE_CACHE.player.y = 5000;
							}
						}

						if (playPortal.isTouched()) {
							//teleport to normal campaign
							CURR_CAMPAIGN = NORMAL_CAMPAIGN;

							//move player outside of the stage
							STAGE_CACHE.player.x = 5000;
							STAGE_CACHE.player.y = 5000;
						}
					}

					//TRACK MANAGEMENT//
					trackUpdate += deltaTime;

					if (trackUpdate > 0.1) {
						//ADD TRACK FOR EVERY TANK
						if (STAGE_CACHE.tracks.length > 300) {
							STAGE_CACHE.tracks.shift();
						}

						STAGE_CACHE.player.trackUpdate();

						for (var i = 0; i < STAGE_CACHE.enemies.length; i++) {
							if (STAGE_CACHE.tracks.length > 300) {
								STAGE_CACHE.tracks.shift();
							}

							const enemy = STAGE_CACHE.enemies[i];

							//dont update tracks for tanks that don't move
							if (enemy.tankType == BROWN_TANK || enemy.tankType == GREEN_TANK)  {
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
							continue;
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

							for (var o = 0; o < STAGE_CACHE.enemies.length; o++) {
								if (STAGE_CACHE.enemies[o].tankID == shell.tankID) {
									STAGE_CACHE.enemies[o].shellShot--;
									break;
								}
							}

							//DELETE SHELL
							STAGE_CACHE.shells.splice(i, 1);
							continue;
						}

						shell.update();
					}

					STAGE_CACHE.player.update();

					for (var i = 0; i < STAGE_CACHE.enemies.length; i++) {
						const enemy = STAGE_CACHE.enemies[i];
						enemy.update();

						//if tanks are white, then turn them invisible
						if (enemy.tankType == WHITE_TANK && !enemy.invisible) {
							playSound(superpower);
							enemy.turnInvisible();
						}
					}

					//start main menu delay when game is won
					if (STAGE_CACHE.menuActivate) {
						STAGE_CACHE.menuDelay += deltaTime;

						if (STAGE_CACHE.menuDelay > 0.4) {
							STAGE_CACHE.menuActivate = false;
							STAGE_CACHE.menuDelay = 0;

							//drop down win menu
							gamePaused = true;
							holding = false;
							pauseMenu.fadeIn = true;
						}
					}

					//if confetti particles are to be made
					if (STAGE_CACHE.activateConfetti) {
						STAGE_CACHE.confettiDelay += deltaTime;

						if (STAGE_CACHE.confettiDelay > 0) {
							//make 30 confetti particles to celebrate
							for (var i = 0; i < 30; i++) {
								STAGE_CACHE.confetti.push(new Confetti((CANVAS_WIDTH / 2) - CONFETTI_PARTICLE_SIDE / 2, (CANVAS_HEIGHT / 2) - CONFETTI_PARTICLE_SIDE / 2));
							}
							STAGE_CACHE.confettiRing++;
							STAGE_CACHE.confettiDelay = 0;
						}

						if (STAGE_CACHE.confettiRing == 5) {
							//stop explosion/rest
							STAGE_CACHE.activateConfetti = false;
							STAGE_CACHE.confettiRing = 0;
							STAGE_CACHE.confettiDelay = 0;

							//activate win menu delay
							STAGE_CACHE.menuActivate = true;
						}
					}

					for (var i = 0; i < STAGE_CACHE.confetti.length; i++) {
						const confetti = STAGE_CACHE.confetti[i];

						if (confetti.explode) {
							//DELETE PARTICLE
							STAGE_CACHE.confetti.splice(i, 1);
							continue;
						}

						confetti.update();
					}

					//update start logo
					if (startLogoShow) {
						startLogoUpdate();
					}
				}
			}
		}

		//if the level isn't the lobby (where you don't need to pause)
		if (CURR_LEVEL !== 0) {
			//update pause button
			pauseButton.update();

			//update pause menu
			if (gamePaused) {
				pauseMenu.update();
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

		//if it is intro, render intro
		if (intro) {
			introRender();
		} else {
			//render level number in game if the level isn't the lobby

			if (CURR_LEVEL !== 0) {
				ctx.font = "100px UniSansHeavy";
				ctx.textAlign = "center";
				ctx.fillStyle = hexToRgbA("#FFC97A", 0.8);
				ctx.fillText(CURR_LEVEL, 120, 150);
			}

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

			//special placement for violet tank protection bubbles :D
			for (var i = 0; i < STAGE_CACHE.violetProtection.length; i++) {
				STAGE_CACHE.violetProtection[i].render();
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

			//render portals
			if (CURR_LEVEL == 0) {
				playPortal.render();
				challengePortal.render();
				customPortal.render();
			}

			for (var i = 0; i < STAGE_CACHE.confetti.length; i++) {
				STAGE_CACHE.confetti[i].render();
			}
		}

		//render intermission
		if (INTERMISSION) {
			intermissionRender();
		}

		//render start logo
		if (startLogoShow) {
			startLogoRender();
		}

		//if the level isn't the lobby (where you don't need to pause)
		if (CURR_LEVEL !== 0) {
			//pause button will be on top of everything
			pauseButton.render();

			//pause menu will be on top of pause button
			pauseMenu.render();
		}
	}

	//KEYBOARD & MOUSE EVENTS//
	canvas.addEventListener("mousedown", e => {
		updateMousePos(e.clientX, e.clientY);
		holding = true;
		
		//if mouse is not on pause button and game is not paused
		if (!gamePaused && STAGE_CACHE) {
			//fine adjustments
			if (CURR_LEVEL == 0) {
				STAGE_CACHE.player.shoot();	
			} else {
				if (!mouseOnPause()) {
					STAGE_CACHE.player.shoot();		
				}
			}
		}
	});

	canvas.addEventListener("mouseup", () => {
		holding = false;
	});

	canvas.addEventListener("mousemove", e => {
		updateMousePos(e.clientX, e.clientY);
	});

	//disable annoying microsoft edge popups
	window.addEventListener("load", () => {
		const edge = window.navigator.userAgent.indexOf("Edge") > -1;

		if (edge) {
			const edgeBrowser = new ActiveXObject("Microsoft.Edge");
			edgeBrowser.BrowserOptions.PopupsBlocked = true;
		}
	});

	window.addEventListener("keydown", e => {
		if (STAGE_CACHE) {
			STAGE_CACHE.player.keys[e.keyCode || e.which] = true;

			//aklsdjglkjdg
			if (e.keyCode == 80 || e.which == 80) {
				STAGE_CACHE.player.pee = true;
			}
		}
	});

	window.addEventListener("keyup", e => {
		if (STAGE_CACHE) {
			delete STAGE_CACHE.player.keys[e.keyCode || e.which];
		
			//industrial society and its future
			if (e.keyCode == 80 || e.which == 80) {
				STAGE_CACHE.player.pee = false;
			}
		}
	});

	window.onblur = function() {
		if (STAGE_CACHE) {
			STAGE_CACHE.player.keys = {};
		}
	};
})();