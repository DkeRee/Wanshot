//intermission screen info and constants
//GOAL: make screen fade in, hold, and then fade out and start new round or restart

const INTERMISSION_INTRO = -1;
const INTERMISSION_RETRY = 0;
const INTERMISSION_WON = 1;
const INTERMISSION_RESTART = 2;
const INTERMISSION_QUIT = 3;

var intermissionStatus = INTERMISSION_RETRY;

var startLogoShow = false;
var startLogoOpacity = 0;

function startLogoUpdate() {
	if (startLogoOpacity >= 0) {
		startLogoOpacity -= 1.3 * deltaTime;
	} else {
		startLogoShow = false;
		startLogoOpacity = 0;
	}
}

function startLogoRender() {
	ctx.font = "100px UniSansHeavy";

	ctx.fillStyle = hexToRgbA("#ffff80", startLogoOpacity);
	
	ctx.lineWidth = 3;
	ctx.strokeStyle = hexToRgbA("#ED4245", startLogoOpacity);

	ctx.textAlign = "center";
	ctx.fillText("START", canvas.width / 2, (canvas.height / 2) + 25);
	ctx.strokeText("START", canvas.width / 2, (canvas.height / 2) + 25);
}

var intermissionDelay = 0;
var maskFadeIn = true;
var maskHold = false;
var maskOpacity = 0;
var maskWait = 0;

//starts with fade in process
function intermissionUpdate() {
	intermissionDelay += deltaTime;

	//let player see that they have died before going to intermission screen
	if (intermissionDelay > 1.5) {
		//if holding, start timer
		if (maskHold) {
			maskWait += deltaTime;

			//if timer reaches, reset timer and start fade out process, once reached start new round or restart and stop intermission
			if (maskWait > 2) {
				maskHold = false;
				maskWait = 0;
				maskFadeIn = false;

				//decide what to do after intermission
				switch (intermissionStatus) {
					case INTERMISSION_RETRY:
						break;
					case INTERMISSION_WON:
						CURR_LEVEL++;
						break;
					case INTERMISSION_RESTART:
						CURR_LEVEL = 1;
						break;
					case INTERMISSION_QUIT:
						CURR_LEVEL = 0;
						break;
					case INTERMISSION_INTRO:
						intro = false;
						break;
				}

				STAGE_CACHE = levelCloner(CURR_LEVEL);
			}
		}

		if (maskFadeIn) {
			//fade in, once reached start hold timer
			maskOpacity += 1.3 * deltaTime;

			if (maskOpacity >= 1) {
				maskOpacity = 1;
				maskHold = true;
			}
		} else {
			//fade out, once reached stop intermission
			maskOpacity -= 2.3 * deltaTime;

			if (maskOpacity <= 0) {
				maskOpacity = 0;
				maskFadeIn = true;
				INTERMISSION = false;

				//display start logo if the level isn't the lobby
				if (CURR_LEVEL !== 0) {
					startLogoShow = true;
					startLogoOpacity = 1;

					playSound(startWhistle);
				}

				//reset intermissionDelay
				intermissionDelay = 0;
			}
		}
	}
}

//renders intermission screen
function intermissionRender() {
	ctx.fillStyle = hexToRgbA("#C2995D", maskOpacity);
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	loadingArt(maskOpacity);
}