//MAIN GRID
const CANVAS_WIDTH = 910;
const CANVAS_HEIGHT = 700;
const grid = [];

//MOUSE COORDS
var mouse = {
	x: 0,
	y: 0
}

const SHADOW = "rgba(0, 0, 0, 0.3)";

var editingBlocks = true;

var floating_cache = null;

const boxSize = 35;
var player = null;
const exportedBlocks = [];
const exportedPits = [];
var holding = false;

//ASSETS//
const REGULAR_BLOCK = 1;
const LOOSE_BLOCK = 2;
const PIT = 3;
const PLAYER = 4;

var currAsset = REGULAR_BLOCK;

function switchEditing(isEditingBlocks) {
	if (isEditingBlocks) {
		//remove floating cache to stop rendering tank overview because we are now editing blocks
		editingBlocks = true;
		floating_cache = null;
	} else {
		//set floating cache to the current floating asset
		editingBlocks = false;

		switch (currAsset) {
			case PLAYER:
				floating_cache = new Player(0.5, 0);
				break;
		}
	}
}