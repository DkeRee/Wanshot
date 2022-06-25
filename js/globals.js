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

//SOUND FX//
const normalShoot = new Audio("audio/normalShoot.wav");
const missleShoot = new Audio("audio/missleShoot.mp3");
const ultraMissleShoot = new Audio("audio/ultraMissleShoot.mp3");
const shellDink = new Audio("audio/shellDink.m4a");
const shellOut = new Audio("audio/shellOut.mp3");
const tankDeath = new Audio("audio/tankDeath.mp3");
const playerDeath = new Audio("audio/playerDeath.wav");
const enemyDeath = new Audio("audio/enemyDeath.wav");
const mineExplosion = new Audio("audio/mineExplosion.wav");
const blockBreaking = new Audio("audio/blockBreaking.mp3");
const minePlace = new Audio("audio/minePlace.wav");
const bombTickOne = new Audio("audio/bombTickOne.wav");
const bombTickTwo = new Audio("audio/bombTickTwo.wav");
const openPause = new Audio("audio/openPause.wav");
const closePause = new Audio("audio/closePause.wav");
const hoverButton = new Audio("audio/hoverButton.mp3");
const tankMovement = new Audio("audio/tankMovement.wav");
const portalEnter = new Audio("audio/portalEnter.wav");
const startWhistle = new Audio("audio/startWhistle.wav");
const confettiPop = new Audio("audio/confettiPop.m4a");
const confettiTrumpet = new Audio("audio/confettiTrumpet.mp3");

//adjust volume
shellDink.volume = 0.2;
shellOut.volume = 0.4;
tankMovement.volume = 0.1;

function playSound(sound) {
	sound.currentTime = 0;
	sound.play();
}

//loading screen art
const blueArtTank = new ArtTank(800, 600, 3, 0, 210, "#224ACF", "#0101BA");
const redArtTank = new ArtTank(100, 80, 3, 0, 30, "#ED4245", "#9E2C2E");

//lobby portals
var playPortal; 

//GAME OBJECT CONSTANTS FOR FINE TUNING PLACEMENTS//
const CONFETTI_PARTICLE_SIDE = 40;

const PORTAL_RADIUS = 100;
const PORTAL_PARTICLE_SIDE = 30;

const STATIONARY_RAY_OFFSET = 4;
const MOBILE_RAY_OFFSET = 3;

const TANK_PARTICLE_SIDE = 20;

const TRACK_WIDTH = 4;
const TRACK_HEIGHT = 7;

const GRAVE_WIDTH = 10;
const GRAVE_HEIGHT = 30;

const SUPERPOWER_PARTICLE_SIDE = 100;

const TANK_WIDTH = 43;
const TANK_HEIGHT = 33;

const HIT_PARTICLE_SIDE = 7;

const MISSLE_PARTICLE_SIDE = 12;

const MINE_RADIUS = 10;
const MINE_EXPLOSION_RADIUS = 110;
const MINE_PARTICLE_SIDE = 15;
const MINE_COUNTDOWN = 10;
const MINE_COLORCOUNTDOWN = 0.05;
const MINE_FUSE = 0.8;
const EXPLOSION_INCR = 610;

const TRAIL_PARTICLE_RADIUS = 5;

const SHELL_WIDTH = 9;
const SHELL_HEIGHT = 6;

const TILE_WIDTH = 35;
const TILE_HEIGHT = 35;
const TILE_PARTICLE_SIDE = 20;

const REGULAR_BLOCK = 1;
const LOOSE_BLOCK = 2;

const BROWN_TANK = 10;
const GREY_TANK = 20;
const YELLOW_TANK = 30;
const PINK_TANK = 40;
const TEAL_TANK = 50;
const PURPLE_TANK = 60;
const WHITE_TANK = 70;
const GREEN_TANK = 80;

const SHADOW = "rgba(0, 0, 0, 0.3)";

//GAME PAUSING//
var gamePaused = false;

//MENU TYPES//
const DEFAULT = 0;
const WIN_VARIATION = 1;
var pauseMenu = new PauseMenu(DEFAULT);

//MOUSE//
var holding = false;
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

//for SAT collision
class BorderTile {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = TILE_WIDTH;
		this.height = TILE_HEIGHT;
		this.angle = 0;
	}
}

const borders = [];

//init border tiles
var x = 0;
var y = -TILE_HEIGHT;

//top border
for (var i = 0; i < CANVAS_WIDTH / TILE_WIDTH; i++) {
	borders.push(new BorderTile(x, y));
	x += TILE_WIDTH;
}

//bottom border
x = 0;
y = CANVAS_HEIGHT;

for (var i = 0; i < CANVAS_WIDTH / TILE_WIDTH; i++) {
	borders.push(new BorderTile(x, y));
	x += TILE_WIDTH;
}

//left border
x = -TILE_WIDTH;
y = 0;

for (var i = 0; i < CANVAS_HEIGHT / TILE_HEIGHT; i++) {
	borders.push(new BorderTile(x, y));
	y += TILE_HEIGHT;
}

//right border
x = CANVAS_WIDTH;
y = 0;

for (var i = 0; i < CANVAS_HEIGHT / TILE_HEIGHT; i++) {
	borders.push(new BorderTile(x, y));
	y += TILE_HEIGHT;
}