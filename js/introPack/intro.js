var slide = 1;
var opacity = 1;
var transition = false;
var fadeOut = true;

var firstSlideGlow = 0;
var glowUp = true;
var buttonBlur = 0;

const buttonX = (CANVAS_WIDTH / 2) - 115;
const buttonY = ((CANVAS_HEIGHT / 2) + 160) - 80;
const buttonWidth = 230;
const buttonHeight = 100;

const background = new Image();
background.src = "icons/background.png";

const tutorialTank = new ArtTank(CANVAS_WIDTH / 2, 240, 3, 0, 0, "#224ACF", "#0101BA");
const addTank = new ArtTank(CANVAS_WIDTH / 2, 260, 3, 180, 180, "#ED4245", "#9E2C2E");

function introUpdate() {
	//if not transitioning
	if (!transition) {
		if (slide == 1) {
			if (glowUp) {
				if (firstSlideGlow < 10) {
					firstSlideGlow += 10 * deltaTime;

					if (firstSlideGlow >= 10) {
						firstSlideGlow = 10;
						glowUp = false;
					}
				}
			} else {
				if (firstSlideGlow > 0) {
					firstSlideGlow -= 10 * deltaTime;

					if (firstSlideGlow <= 0) {
						firstSlideGlow = 0;
						glowUp = true;
					}
				}
			}

			//if mouse is on button
			if ((buttonX <= MOUSE_POS.x && MOUSE_POS.x <= buttonX + buttonWidth) && (buttonY <= MOUSE_POS.y && MOUSE_POS.y <= buttonY + buttonHeight)) {
				canvas.style.cursor = "pointer";

				if (buttonBlur < 10) {
					buttonBlur += 50 * deltaTime;

					if (buttonBlur >= 10) {
						buttonBlur = 10;
					}
				}

				if (holding) {
					//button has been clicked
					holding = false;
					transition = true;
					canvas.style.cursor = "auto";
					playSound(introClick);
				}
			} else {
				canvas.style.cursor = "auto";
		
				if (buttonBlur > 0) {
					buttonBlur -= 50 * deltaTime;

					if (buttonBlur <= 0) {
						buttonBlur = 0;
					}
				}
			}
		} else {
			if (holding && slide < 4) {
				//click anywhere to move on
				holding = false;
				transition = true;
				canvas.style.cursor = "auto";
				playSound(introClick);
			}
		}
	} else {
		//update transition
		if (fadeOut) {
			opacity -= deltaTime;

			if (opacity <= 0) {
				opacity = 0;
				fadeOut = false;
				slide++;

				switch(slide) {
					case 2:
						//tutorial
						playSound(tutorial);
						break;
					case 3:
						//additional information:
						playSound(additionalInformation);
						break;
					case 4:
						//start game
						playSound(startWhistle);
						intermissionStatus = INTERMISSION_INTRO;
						maskFadeIn = true;
						INTERMISSION = true;
						break;
				}
			}
		} else {
			opacity += deltaTime;
			if (opacity >= 1) {
				opacity = 1;
				fadeOut = true;
				transition = false;
			}
		}
	}
}

function introRender() {
	switch (slide) {
		case 1:
			//title screen
			ctx.globalAlpha = opacity;
			ctx.drawImage(background, (canvas.width / 2) - (background.width / 2) - 100, (canvas.height / 2) - (background.height / 2) - 48, background.width * 1.15, background.height * 1.15);
			ctx.globalAlpha = 1;

			ctx.shadowBlur = buttonBlur;
			ctx.shadowColor = "#ED4245";

			ctx.strokeStyle = hexToRgbA("#ED4245", opacity);
			ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

			ctx.shadowBlur = 0;

			ctx.fillStyle = hexToRgbA("#ED4245", opacity / 4);
			ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

			ctx.shadowBlur = firstSlideGlow;
			ctx.shadowColor = "#ED4245";
			ctx.font = "80px UniSansHeavy";

			ctx.fillStyle = hexToRgbA("#ffff80", opacity);
			
			ctx.lineWidth = 3;
			ctx.strokeStyle = hexToRgbA("#ED4245", opacity);

			ctx.textAlign = "center";
			ctx.fillText("PLAY", canvas.width / 2, (canvas.height / 2) + 160);
			ctx.strokeText("PLAY", canvas.width / 2, (canvas.height / 2) + 160);		

			ctx.shadowBlur = 10;
			ctx.shadowColor = hexToRgbA("#ED4245", opacity);

			ctx.font = "130px UniSansHeavy";
			ctx.fillStyle = hexToRgbA("#ffff80", opacity);

			ctx.lineWidth = 3;
			ctx.strokeStyle = hexToRgbA("#ED4245", startLogoOpacity);

			ctx.textAlign = "center";
			ctx.fillText("WANKLE", canvas.width / 2, (canvas.height / 2) - 60);
			ctx.strokeText("WANKLE", canvas.width / 2, (canvas.height / 2) - 60);

			//render version ID
			ctx.font = "30px UniSansHeavy";
			ctx.fillText(`V${VERSION}`, canvas.width - 50, 30);
			ctx.strokeText(`V${VERSION}`, canvas.width - 50, 30);	

			ctx.font = "80px UniSansHeavy";
			ctx.fillText("BY DKEREE", canvas.width / 2, (canvas.height / 2) + 20);
			ctx.strokeText("BY DKEREE", canvas.width / 2, (canvas.height / 2) + 20);

			ctx.shadowBlur = 0;
			break;
		case 2:
			//header
			ctx.font = "100px UniSansHeavy";
			ctx.fillStyle = hexToRgbA("#ffff80", opacity);

			ctx.lineWidth = 3;
			ctx.strokeStyle = hexToRgbA("#ED4245", opacity);

			ctx.textAlign = "center";
			ctx.fillText("HOW TO PLAY", canvas.width / 2, 130);
			ctx.strokeText("HOW TO PLAY", canvas.width / 2, 130);

			//tank
			tutorialTank.render(opacity);

			ctx.shadowBlur = 10;
			ctx.shadowColor = "#ED4245";

			ctx.font = "25px UniSansHeavy";
			ctx.fillStyle = hexToRgbA("#ffff80", opacity);

			ctx.textAlign = "center";

			//paragraph one
			ctx.fillText(moveTextOne, canvas.width / 2, 400);
			ctx.fillText(moveTextTwo, canvas.width / 2, 400 + spacing);
			ctx.fillText(moveTextThree, canvas.width / 2, 400 + spacing * 2);

			//paragraph two
			ctx.fillText(shootTextOne, canvas.width / 4, 550);
			ctx.fillText(shootTextTwo, canvas.width / 4, 550 + spacing);
			ctx.fillText(shootTextThree, canvas.width / 4, 550 + spacing * 2);

			//paragraph three
			ctx.fillText(mineTextOne, canvas.width / 1.35, 550);
			ctx.fillText(mineTextTwo, canvas.width / 1.35, 550 + spacing);
			ctx.fillText(mineTextThree, canvas.width / 1.35, 550 + spacing * 2);

			//footer
			ctx.fillText(endText, canvas.width / 2, CANVAS_HEIGHT - spacing);

			ctx.shadowBlur = 0;
			break;
		case 3:
			//additional information

			//header
			ctx.font = "100px UniSansHeavy";
			ctx.fillStyle = hexToRgbA("#ffff80", opacity);

			ctx.lineWidth = 3;
			ctx.strokeStyle = hexToRgbA("#ED4245", opacity);

			ctx.textAlign = "center";
			ctx.fillText("OTHER INFO", canvas.width / 2, 130);
			ctx.strokeText("OTHER INFO", canvas.width / 2, 130);

			//tank
			addTank.render(opacity);

			ctx.shadowBlur = 10;
			ctx.shadowColor = "#ED4245";
			ctx.font = "25px UniSansHeavy";

			//disclaimer
			ctx.fillText(addTextOne, canvas.width / 2, 420);
			ctx.fillText(addTextTwo, canvas.width / 2, 420 + spacing);
			ctx.fillText(addTextThree, canvas.width / 2, 420 + spacing * 2);
			ctx.fillText(addTextFour, canvas.width / 2, 420 + spacing * 3);
			ctx.fillText(addTextFive, canvas.width / 2, 420 + spacing * 4);

			//footer
			ctx.fillText(endText, canvas.width / 2, CANVAS_HEIGHT - spacing * 2);

			ctx.shadowBlur = 0;
			break;
	}
}