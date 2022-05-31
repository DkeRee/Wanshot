//intermission screen info and constants
//GOAL: make screen fade in, hold, and then fade out and start new round or restart

var startLogoShow = false;
var startLogoOpacity = 0;

function startLogoUpdate() {
	if (startLogoOpacity >= 0) {
		startLogoOpacity -= 0.02;
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

var maskFadeIn = true;
var maskHold = false;
var maskOpacity = 0;
var maskWait = 0;

//starts with fade in process
function intermissionUpdate() {
	//if holding, start timer
	if (maskHold) {
		maskWait++;

		//if timer reaches, reset timer and start fade out process, once reached start new round or restart and stop intermission
		if (maskWait > 80) {
			maskHold = false;
			maskWait = 0;
			maskFadeIn = false;
			STAGE_CACHE = levelCloner(CURR_LEVEL);
		}
	}

	if (maskFadeIn) {
		//fade in, once reached start hold timer
		maskOpacity += 0.02;

		if (maskOpacity >= 1) {
			maskOpacity = 1;
			maskHold = true;
		}
	} else {
		//fade out, once reached stop intermission
		maskOpacity -= 0.02;

		if (maskOpacity <= 0) {
			maskOpacity = 0;
			maskFadeIn = true;
			INTERMISSION = false;

			//display start logo
			startLogoShow = true;
			startLogoOpacity = 1;
		}
	}
}

//renders intermission screen
function intermissionRender() {
	ctx.fillStyle = hexToRgbA("#C2995D", maskOpacity);
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}