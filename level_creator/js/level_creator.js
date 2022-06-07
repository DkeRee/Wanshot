(function() {
	const BACKGROUND_COLOR_STRONG = "#C2995D";
	const BACKGROUND_COLOR_WEAK = "#FFDFA8";

	const CANVAS_WIDTH = 910;
	const CANVAS_HEIGHT = 700;

	//DELTA TIME
	const FPS_INTERVAL = 1000/200;
	var globalThen = Date.now();

	//INIT CANVAS/
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;

	const AREA = (CANVAS_WIDTH / boxSize) * (CANVAS_HEIGHT / boxSize);
	const grid = [];

	//init grid
	var x = 0;
	var y = 0;

	for (var i = 0; i < AREA; i++) {
		grid.push(new Box(x, y, boxSize));

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