(function() {
	$("html").bind('contextmenu', () => {
		return false;
	});

	//GLOBAL CANVAS CONSTANTS//
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");

	const BACKGROUND_COLOR = "#C2995D";

	const CANVAS_WIDTH = 910;
	const CANVAS_HEIGHT = 700;

	//DELTA TIME
	const FPS_INTERVAL = 1000/100;
	var globalThen = Date.now();

	//MOUSE COORDS
	var mouse = {
		x: 0,
		y: 0
	}

	//INIT CANVAS/
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;

	const boxSize = 35;
	const AREA = (CANVAS_WIDTH / boxSize) * (CANVAS_HEIGHT / boxSize);
	const grid = [];

	const exportedBlocks = [];

	var holding = false;

	class Box {
		constructor(x, y) {
			this.side = boxSize;
			this.hovered = false;
			this.marked = false;
			this.clicked = false;
			this.x = x;
			this.y = y;

			this.id = Math.floor(Math.random() * 100000);

			this.hoveredColor = "rgba(237, 66, 69, 0.5)";
			this.markedColor = "rgba(156, 123, 75, 1)";
		}

		update() {
			//mouse collision
			if ((this.x <= mouse.x && mouse.x <= this.x + this.side) && (this.y <= mouse.y && mouse.y <= this.y + this.side)) {
				this.hovered = true;

				//mark or unmark
				if (holding) {
					if (!this.clicked) {
						if (!this.marked) {
							//place tile
							this.marked = true;

							exportedBlocks[this.id] = `new Block(${this.x}, ${this.y})`;
						} else {
							//unplace tile
							this.marked = false;
							delete exportedBlocks[this.id];
						}
					}

					this.clicked = true;
				}
			} else {
				this.hovered = false;
				this.clicked = false;
			}
		}

		render() {
			if (this.marked) {
				ctx.fillStyle = this.markedColor;
				ctx.fillRect(this.x, this.y, this.side, this.side);
			} else if (this.hovered) {
				ctx.fillStyle = this.hoveredColor;
				ctx.fillRect(this.x, this.y, this.side, this.side);
			}

			ctx.beginPath();
			ctx.rect(this.x, this.y, this.side, this.side);
			ctx.stroke();
		}
	}

	//init grid

	var x = 0;
	var y = 0;

	for (var i = 0; i < AREA; i++) {
		grid.push(new Box(x, y));

		if (x + boxSize == CANVAS_WIDTH) {
			x = 0;
			y += boxSize;
		} else {
			x += boxSize;
		}
	}

	function globalStep() {
		const now = Date.now();
		const elapsed = now - globalThen;

		if (elapsed > FPS_INTERVAL) {
			globalUpdate();
			globalThen = now - (elapsed % FPS_INTERVAL);
		}

		globalRender();

		requestAnimationFrame(globalStep);
	}
	requestAnimationFrame(globalStep);

	function globalUpdate() {
		for (var i = 0; i < grid.length; i++) {
			grid[i].update();
		}
	}

	function globalRender() {
		//CLEAR CANVAS FOR NEXT FRAME//
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		//RENDER BACKGROUND//
		ctx.fillStyle = BACKGROUND_COLOR;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		for (var i = 0; i < grid.length; i++) {
			grid[i].render();
		}
	}

	function updateMousePos(clientX, clientY) {
		const rect = canvas.getBoundingClientRect();
		mouse = {
			x: clientX - rect.left,
			y: clientY - rect.top
		}
	}

	function exportBlocks() {
		var blockExport = "tiles: [";

		for (blockID in exportedBlocks) {
			blockExport += exportedBlocks[blockID];

			if (Number(blockID) !== exportedBlocks.length - 1) {
				blockExport += ", ";
			}
		}

		blockExport += "]";

		var blob = new Blob([blockExport],
			{type: "text/plain;charset=utf-8"});
		saveAs(blob, "level.txt");
	}

	//KEYBOARD & MOUSE EVENTS//
	canvas.addEventListener("mousemove", e => {
		updateMousePos(e.clientX, e.clientY);
	});

	canvas.addEventListener("mousedown", e => {
		updateMousePos(e.clientX, e.clientY);
		holding = true;
	});

	canvas.addEventListener("mouseup", e => {
		updateMousePos(e.clientX, e.clientY);
		holding = false;
	});

	window.addEventListener("keydown", e => {
		if (e.keyCode == 13) {
			exportBlocks();
		}
	});
})();