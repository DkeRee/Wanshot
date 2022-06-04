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

//GAME OBJECT CONSTANTS FOR FINE TUNING PLACEMENTS//
const TANK_PARTICLE_SIDE = 20;

const TRACK_WIDTH = 4;
const TRACK_HEIGHT = 7;

const GRAVE_WIDTH = 10;
const GRAVE_HEIGHT = 30;

const TANK_WIDTH = 45;
const TANK_HEIGHT = 35;

const HIT_PARTICLE_SIDE = 7;

const TRAIL_PARTICLE_RADIUS = 5;

const SHELL_WIDTH = 10;
const SHELL_HEIGHT = 7;

const TILE_WIDTH = 50;
const TILE_HEIGHT = 50;