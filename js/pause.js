const RESUME = 0;
const RESTART = 1;
const QUIT = 2;

class PauseButton {
	constructor() {
		this.side = 50;
		this.x = CANVAS_WIDTH - this.side * 1.1;
		this.y = 5;
		
		this.color = "#FFDFA8";
		this.outerRingRadius = 23;

		this.shadowBlur = 2;

		this.rectWidth = 7;
		this.rectHeight = 25;
	}

	update() {
		//if mouse is inside the pause button
		if ((this.x <= MOUSE_POS.x && MOUSE_POS.x <= this.x + this.side) && (this.y <= MOUSE_POS.y && MOUSE_POS.y <= this.y + this.side) && !gamePaused) {
			canvas.style.cursor = "pointer";

			//clicked on pause button
			if (holding) {
				gamePaused = true;
				holding = false;

				//make sure pause menu is default
				pauseMenu = new PauseMenu(DEFAULT);
				pauseMenu.fadeIn = true;
			}

			if (this.shadowBlur < 10) {
				this.shadowBlur += 50 * deltaTime;
			} else {
				this.shadowBlur = 10;
			}
		} else {
			canvas.style.cursor = "auto";

			if (this.shadowBlur > 2) {
				this.shadowBlur -= 50 * deltaTime;
			} else {
				this.shadowBlur = 2;
			}
		}
	}

	render() {
		//draw base
		ctx.shadowBlur = this.shadowBlur;
		ctx.shadowColor = this.color;

		ctx.strokeStyle = this.color;
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.arc(this.x + this.side / 2, this.y + this.side / 2, this.outerRingRadius, 0, 2 * Math.PI, false);
		ctx.stroke();

		//draw left rect
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x + this.side / 3.8, this.y + this.side / 4, this.rectWidth, this.rectHeight);

		//draw right rect
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x + this.side / 1.65, this.y + this.side / 4, this.rectWidth, this.rectHeight);

		ctx.shadowBlur = 0;
	}
}

class PauseMenu {
	constructor(variation) {
		this.backgroundColor = "#EDBB72";
		this.buttonColor = "#EDA05C";

		this.fadeIn = false;
		this.fadeOut = false;

		this.dropDown = false;
		this.swipeUp = false;

		this.opacity = 0;
		this.maxOpacity = 0.4;

		this.buttonWidth = 450;
		this.buttonHeight = 180;

		this.resumeX = (canvas.width / 2) - (this.buttonWidth / 2);
		this.resumeY = -400;
		this.resumeVelocity = 210;
		this.resumeBlur = 3;

		this.restartX = (canvas.width / 2) - (this.buttonWidth / 2);
		this.restartY = -400;
		this.restartVelocity = 330;
		this.restartBlur = 3;

		this.quitX = (canvas.width / 2) - (this.buttonWidth / 2);
		this.quitY = -400;
		this.quitVelocity = 450;
		this.quitBlur = 3;

		//specifies the type of pause menu
		this.variation = variation;

		this.exitFunction = RESUME;
	}

	update() {
		//if the pause menu is supposed to fade in, fade in
		if (this.fadeIn) {
			if (this.opacity <= this.maxOpacity) {
				this.opacity += 1.5 * deltaTime;
			} else {
				this.opacity = this.maxOpacity;
				this.fadeIn = false;
				this.dropDown = true;
			}
		}

		//if the pause menu is supposed to fade out, fade out
		if (this.fadeOut) {
			if (this.opacity >= 0) {
				this.opacity -= 3 * deltaTime;
			} else {
				this.opacity = 0;
				this.fadeOut = false;
				gamePaused = false;

				switch (this.exitFunction) {
					case RESUME:
						//do nothing
						break;
					case RESTART:
						STAGE_CACHE.player.explode();
						intermissionStatus = INTERMISSION_RESTART;
						maskFadeIn = true;
						INTERMISSION = true;
						break;
					case QUIT:
						STAGE_CACHE.player.explode();
						intermissionStatus = INTERMISSION_QUIT;
						maskFadeIn = true;
						INTERMISSION = true;
						break;
				}
			}	
		}

		//swipe up the pause menu
		if (this.swipeUp) {
			this.resumeY -= this.resumeVelocity;
			this.resumeVelocity *= 2;

			this.restartY -= this.restartVelocity;
			this.restartVelocity *= 2;

			this.quitY -= this.quitVelocity;
			this.quitVelocity *= 2;

			if (this.resumeY <= -400 && this.restartY <= -400 && this.quitY <= -400) {
				this.swipeUp = false;

				this.resumeY = -400;
				this.restartY = -400;
				this.quitY = -400;

				this.resumeVelocity = 210;
				this.restartVelocity = 330;
				this.quitVelocity = 450;

				this.fadeOut = true;
			}
		}

		//drop down the pause menu
		if (this.dropDown) {
			this.resumeY += this.resumeVelocity;
			this.resumeVelocity /= 2;

			this.restartY += this.restartVelocity;
			this.restartVelocity /= 2;

			this.quitY += this.quitVelocity;
			this.quitVelocity /= 2;

			if (this.resumeVelocity <= 1 || this.restartVelocity <= 1 || this.quitVelocity <= 1) {
				this.dropDown = false;
			}
		}

		//loop through the three buttons
		for (var i = 0; i < 3; i++) {
			var detectedMouse = false;

			switch (i) {
				case 0:
					//resume

					//check for resume button ONLY if variation is default
					if (this.variation == DEFAULT) {
						if ((this.resumeX <= MOUSE_POS.x && MOUSE_POS.x <= this.resumeX + this.buttonWidth) && (this.resumeY <= MOUSE_POS.y && MOUSE_POS.y <= this.resumeY + this.buttonHeight) && gamePaused) {
							//glow
							if (this.resumeBlur < 10) {
								this.resumeBlur += 50 * deltaTime;
							} else {
								this.resumeBlur = 10
							}
							canvas.style.cursor = "pointer";
							detectedMouse = true;
						
							if (holding) {
								holding = false;
								pauseMenu.swipeUp = true;

								this.exitFunction = RESUME;
							}

						} else {
							//glow down
							if (this.resumeBlur > 3) {
								this.resumeBlur -= 50 * deltaTime;
							} else {
								this.resumeBlur = 3;
							}
							canvas.style.cursor = "auto";
						}
					}
					break;
				case 1:
					//restart
					if ((this.restartX <= MOUSE_POS.x && MOUSE_POS.x <= this.restartX + this.buttonWidth) && (this.restartY <= MOUSE_POS.y && MOUSE_POS.y <= this.restartY + this.buttonHeight) && gamePaused) {
						//glow
						if (this.restartBlur < 10) {
							this.restartBlur += 50 * deltaTime;
						} else {
							this.restartBlur = 10
						}
						canvas.style.cursor = "pointer";
						detectedMouse = true;

						if (holding) {
							holding = false;
							pauseMenu.swipeUp = true;

							this.exitFunction = RESTART;
						}
					} else {
						//glow down
						if (this.restartBlur > 3) {
							this.restartBlur -= 50 * deltaTime;
						} else {
							this.restartBlur = 3;
						}
						canvas.style.cursor = "auto";
					}
					break;
				case 2:
					//quit
					if ((this.quitX <= MOUSE_POS.x && MOUSE_POS.x <= this.quitX + this.buttonWidth) && (this.quitY <= MOUSE_POS.y && MOUSE_POS.y <= this.quitY + this.buttonHeight) && gamePaused) {
						//glow
						if (this.quitBlur < 10) {
							this.quitBlur += 50 * deltaTime;
						} else {
							this.quitBlur = 10
						}
						canvas.style.cursor = "pointer";
						detectedMouse = true;

						if (holding) {
							holding = false;
							pauseMenu.swipeUp = true;

							this.exitFunction = QUIT;
						}
					} else {
						//glow down
						if (this.quitBlur > 3) {
							this.quitBlur -= 50 * deltaTime;
						} else {
							this.quitBlur = 3;
						}
						canvas.style.cursor = "auto";
					}
					break;
			}

			if (detectedMouse) {
				break;
			}
		}
	}

	render() {
		//render pause menu background
		ctx.fillStyle = hexToRgbA(this.backgroundColor, this.opacity);
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		if (this.variation == DEFAULT) {
			//draw resume button ONLY if variation is default
			ctx.shadowColor = "#FEE75C";
			ctx.fillStyle = this.buttonColor;

			ctx.shadowBlur = this.resumeBlur;
			ctx.fillRect(this.resumeX, this.resumeY, this.buttonWidth, this.buttonHeight);

			ctx.textAlign = "center";
			ctx.font = "80px UniSansHeavy";
			ctx.fillStyle = "#ffff80";
			
			ctx.lineWidth = 3;
			ctx.strokeStyle = "#ED4245";
			ctx.fillText("RESUME", this.resumeX + this.buttonWidth / 2, (this.resumeY + this.buttonHeight / 2) + 30);
			ctx.strokeText("RESUME", this.resumeX + this.buttonWidth / 2, (this.resumeY + this.buttonHeight / 2) + 26);
		} else {
			//else draw win sign
			ctx.font = "130px UniSansHeavy";
			ctx.textAlign = "center";

			ctx.lineWidth = 3;
			ctx.strokeStyle = "#ED4245";

			ctx.fillStyle = "#ffff80";

			ctx.shadowBlur = 10;
			ctx.shadowColor = "#ED4245";

			ctx.fillText("You Won", this.resumeX + this.buttonWidth / 2, (this.resumeY + this.buttonHeight / 2) + 70);
			ctx.strokeText("You Won", this.resumeX + this.buttonWidth / 2, (this.resumeY + this.buttonHeight / 2) + 70);
		}
	
		//draw restart button
		ctx.shadowColor = "#FEE75C";
		ctx.fillStyle = this.buttonColor;

		ctx.shadowBlur = this.restartBlur;
		ctx.fillRect(this.restartX, this.restartY, this.buttonWidth, this.buttonHeight);

		ctx.textAlign = "center";
		ctx.font = "80px UniSansHeavy";
		ctx.fillStyle = "#ffff80";
		
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#ED4245";
		ctx.fillText("RESTART", this.restartX + this.buttonWidth / 2, (this.restartY + this.buttonHeight / 2) + 30);
		ctx.strokeText("RESTART", this.restartX + this.buttonWidth / 2, (this.restartY + this.buttonHeight / 2) + 26);

		//draw quit button
		ctx.shadowColor = "#FEE75C";
		ctx.fillStyle = this.buttonColor;

		ctx.shadowBlur = this.quitBlur;
		ctx.fillRect(this.quitX, this.quitY, this.buttonWidth, this.buttonHeight);

		ctx.textAlign = "center";
		ctx.font = "80px UniSansHeavy";
		ctx.fillStyle = "#ffff80";
		
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#ED4245";
		ctx.fillText("QUIT", this.quitX + this.buttonWidth / 2, (this.quitY + this.buttonHeight / 2) + 30);
		ctx.strokeText("QUIT", this.quitX + this.buttonWidth / 2, (this.quitY + this.buttonHeight / 2) + 26);

		ctx.shadowBlur = 0;
	}
}