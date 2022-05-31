const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 550;

//INIT CANVAS/
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

//CURRENT STAGE
var STAGE_CACHE;
var CURR_LEVEL;
var INTERMISSION = false;

//loading screen art
const blueArtTank = new ArtTank(700, 470, 3, 0, 210, "#224ACF", "#0101BA");
const redArtTank = new ArtTank(100, 80, 3, 0, 30, "#ED4245", "#9E2C2E");

var MOUSE_POS = {
	x: NaN,
	y: NaN
};
const PLAYER_ID = Math.floor(Math.random() * 100000);

function updateMousePos(clientX, clientY) {
	const rect = canvas.getBoundingClientRect();
	MOUSE_POS = {
		x: clientX - rect.left,
		y: clientY - rect.top
	}
}