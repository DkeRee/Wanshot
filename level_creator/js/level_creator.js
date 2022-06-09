(function() {
	const BACKGROUND_COLOR_STRONG = "#C2995D";
	const BACKGROUND_COLOR_WEAK = "#FFDFA8";

	const CANVAS_WIDTH = 910;
	const CANVAS_HEIGHT = 700;

	//INIT CANVAS/
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;

	const gridWidth = CANVAS_WIDTH / boxSize;
	const gridHeight = CANVAS_HEIGHT / boxSize;
	const AREA = gridWidth * gridHeight;
	const grid = [];

	//init grid
	var x = 0;
	var y = 0;

	for (var i = 0; i < AREA; i++) {
		grid.push(new Box(x, y, boxSize, i));

		//if this box is on the side, automatically make it into a solid block
		if (x == 0 || x == CANVAS_WIDTH - boxSize || y == 0 || y == CANVAS_HEIGHT - boxSize) {
			const box = grid[i];
			box.marked = true;
			box.content = new Block(box.x, box.y, 1, REGULAR_BLOCK);
			exportedBlocks[box.id] = `new Block(${box.x}, ${box.y}, ${REGULAR_BLOCK})`;
		}

		if (x + boxSize == CANVAS_WIDTH) {
			x = 0;
			y += boxSize;
		} else {
			x += boxSize;
		}
	}

	function globalStep() {
		globalUpdate();
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
		var grd = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, CANVAS_WIDTH / 2.1, canvas.width / 2, canvas.height / 2, CANVAS_WIDTH);
		grd.addColorStop(0, BACKGROUND_COLOR_STRONG);
		grd.addColorStop(1, BACKGROUND_COLOR_WEAK);

		ctx.fillStyle = grd;
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

	function exportAssets() {
		var levelExport = "0: {";

		//set up exports
		//temp hardcode
		var playerExport = "player: new Player(100, 100, 0, 0),";

		//temp hardcode
		var enemyExport = "enemies: [],";

		var blockExport = "tiles: [";

		for (var blockID in exportedBlocks) {
			blockExport += exportedBlocks[blockID];

			if (Number(blockID) !== exportedBlocks.length - 1) {
				blockExport += ", ";
			}
		}

		blockExport += "],";

		var pitExport = "pits: [";

		for (var pitID in exportedPits) {
			pitExport += exportedPits[pitID];

			if (Number(pitID) !== exportedPits.length - 1) {
				pitExport += ", ";
			}
		}

		pitExport += "],";

		//append them to level export
		levelExport += playerExport;
		levelExport += enemyExport;
		levelExport += blockExport;
		levelExport += pitExport;

		levelExport += "},";

		var blob = new Blob([levelExport],
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

	//temporary keybinds before I add UI
	window.addEventListener("keydown", e => {
		if (e.keyCode == 13) {
			exportAssets();
		}
	});

	window.addEventListener("keydown", e => {
		switch (e.keyCode) {
			case 49:
				currAsset = REGULAR_BLOCK;
				break;
			case 50:
				currAsset = LOOSE_BLOCK;
				break;
			case 51:
				currAsset = PIT;
				break;
		}
	});
})();