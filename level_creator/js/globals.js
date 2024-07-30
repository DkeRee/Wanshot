//MAIN GRID
const CANVAS_WIDTH = 910;
const CANVAS_HEIGHT = 700;
var grid = [];

//MOUSE COORDS
var mouse = {
	x: CANVAS_WIDTH / 2,
	y: CANVAS_HEIGHT / 2
}

const SHADOW = "rgba(0, 0, 0, 0.3)";

var editingBlocks = true;

var floating_cache = {
	content: null,
	pause: false
};

//CAMPAIGN
var campaignIndex = 0;
var CAMPAIGN = [];

const boxSize = 35;
var holding = false;

const leftArrow = document.getElementsByClassName("bottom-widget")[0];
const rightArrow = document.getElementsByClassName("bottom-widget")[4];

const gridWidth = CANVAS_WIDTH / boxSize;
const gridHeight = CANVAS_HEIGHT / boxSize;
const AREA = gridWidth * gridHeight;

//ASSETS//
const REGULAR_BLOCK = 1;
const LOOSE_BLOCK = 2;
const PIT = 3;
const PLAYER = 4;
const BROWN_TANK = 5;
const GREY_TANK = 6;
const YELLOW_TANK = 7;
const PINK_TANK = 8;
const TEAL_TANK = 9;
const PURPLE_TANK = 10;
const WHITE_TANK = 11;
const GREEN_TANK = 12;
const BLACK_TANK = 13;
const ORANGE_TANK = 14;
const BLURPLE_TANK = 15;
const VIOLET_TANK = 16;
const TAN_TANK = 17;

var currAsset = REGULAR_BLOCK;

function switchEditing(isEditingBlocks) {
	if (isEditingBlocks) {
		//remove floating cache to stop rendering tank overview because we are now editing blocks
		editingBlocks = true;
		floating_cache.content = null;
	} else {
		//set floating cache to the current floating asset
		editingBlocks = false;

		switch (currAsset) {
			case PLAYER:
				floating_cache.content = new Player(0.5, 0);
				break;
			case BROWN_TANK:
				floating_cache.content = new BrownTank(0.5, 0);
				break;
			case GREY_TANK:
				floating_cache.content = new GreyTank(0.5, 0);
				break;
			case YELLOW_TANK:
				floating_cache.content = new YellowTank(0.5, 0);
				break;
			case PINK_TANK:
				floating_cache.content = new PinkTank(0.5, 0);
				break;
			case TEAL_TANK:
				floating_cache.content = new TealTank(0.5, 0);
				break;
			case PURPLE_TANK:
				floating_cache.content = new PurpleTank(0.5, 0);
				break;
			case WHITE_TANK:
				floating_cache.content = new WhiteTank(0.5, 0);
				break;
			case GREEN_TANK:
				floating_cache.content = new GreenTank(0.5, 0);
				break;
			case BLACK_TANK:
				floating_cache.content = new BlackTank(0.5, 0);
				break;
			case TAN_TANK:
				floating_cache.content = new TanTank(0.5, 0);
				break;
			case BLURPLE_TANK:
				floating_cache.content = new BlurpleTank(0.5, 0);
				break;			
			case ORANGE_TANK:
				floating_cache.content = new OrangeTank(0.5, 0);
				break;
			case VIOLET_TANK:
				floating_cache.content = new VioletTank(0.5, 0);
				break;
		}
	}
}