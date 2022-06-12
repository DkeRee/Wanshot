//essential delta time info//
const deltaTime = 1 / 60;
var accTime = 0;
var lastTime = 0;

const CANVAS_WIDTH = 910;
const CANVAS_HEIGHT = 700;

//INIT CANVAS/
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

//CURRENT STAGE
var STAGE_CACHE;
var CURR_LEVEL;
var INTERMISSION = false;

//loading screen art
const blueArtTank = new ArtTank(800, 600, 3, 0, 210, "#224ACF", "#0101BA");
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

const TANK_WIDTH = 43;
const TANK_HEIGHT = 33;

const HIT_PARTICLE_SIDE = 7;

const MINE_RADIUS = 10;
const MINE_EXPLOSION_RADIUS = 110;
const MINE_PARTICLE_SIDE = 15;
const MINE_COUNTDOWN = 10;
const MINE_COLORCOUNTDOWN = 0.05;
const MINE_FUSE = 0.8;
const EXPLOSION_INCR = 610;

const TRAIL_PARTICLE_RADIUS = 5;

const SHELL_WIDTH = 8.5;
const SHELL_HEIGHT = 2;

const TILE_WIDTH = 35;
const TILE_HEIGHT = 35;
const TILE_PARTICLE_SIDE = 20;

const REGULAR_BLOCK = 1;
const LOOSE_BLOCK = 2;

const BROWN_TANK = 10;

const SHADOW = "rgba(0, 0, 0, 0.3)";

var tempRay = new Ray(new xy(0, 0), new xy(0, 0));