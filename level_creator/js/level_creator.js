(function() {
	const fileReader = new FileReader();

	fileReader.onload = function() {
		const data = JSON.parse(fileReader.result);

		//reset
		switchEditing(true);

		//init grid once again
		var x = 0;
		var y = 0;

		grid = [];

		for (var i = 0; i < AREA; i++) {
			grid.push(new Box(x, y, boxSize, i));

			if (x + boxSize == CANVAS_WIDTH) {
				x = 0;
				y += boxSize;
			} else {
				x += boxSize;
			}
		}

		player = null;
		exportedEnemies = [];
		exportedBlocks = [];
		exportPits = [];
		holding = false;

		//player
		mouse = {
			x: data.player.tank.centerX,
			y: data.player.tank.centerY
		};
		player = new Player(1, data.player.angle);
		
		//enemies
		console.log(data)
		for (var i = 0; i < data.enemies.length; i++) {
			mouse = {
				x: data.enemies[i].tank.centerX,
				y: data.enemies[i].tank.centerY
			};

			switch (data.enemies[i].content) {
				case BROWN_TANK:
					exportedEnemies.push(new BrownTank(1, data.enemies[i].tank.angle));
					break;
				case GREY_TANK:
					exportedEnemies.push(new GreyTank(1, data.enemies[i].tank.angle))
					break;
				case YELLOW_TANK:
					exportedEnemies.push(new YellowTank(1, data.enemies[i].tank.angle))
					break;
				case PINK_TANK:
					exportedEnemies.push(new PinkTank(1, data.enemies[i].tank.angle))
					break;
				case TEAL_TANK:
					exportedEnemies.push(new TealTank(1, data.enemies[i].tank.angle))
					break;
				case PURPLE_TANK:
					exportedEnemies.push(new PurpleTank(1, data.enemies[i].tank.angle))
					break;
				case WHITE_TANK:
					exportedEnemies.push(new WhiteTank(1, data.enemies[i].tank.angle))
					break;
				case GREEN_TANK:
					exportedEnemies.push(new GreenTank(1, data.enemies[i].tank.angle))
					break;					
			}
		}
		
		//no need to worry about null in the static assets!

		//blocks
		
		for (var i = 0; i < data.blocks.length; i++) {
			//update export

			if (data.blocks[i].content.kind == REGULAR_BLOCK) {
				const regularBlock = new Block(data.blocks[i].x, data.blocks[i].y, 1, REGULAR_BLOCK);
				
				//update display
				grid[data.blocks[i].id].marked = true;
				grid[data.blocks[i].id].blockType = REGULAR_BLOCK;
				grid[data.blocks[i].id].content = regularBlock;

				exportedBlocks[data.blocks[i].id] = grid[data.blocks[i].id];
			} else {
				const looseBlock = new Block(data.blocks[i].x, data.blocks[i].y, 1, LOOSE_BLOCK);
				
				//update display
				grid[data.blocks[i].id].marked = true;
				grid[data.blocks[i].id].blockType = LOOSE_BLOCK;
				grid[data.blocks[i].id].content = looseBlock;

				exportedBlocks[data.blocks[i].id] = grid[data.blocks[i].id];
			}
		}

		//pits
		for (var i = 0; i < data.pits.length; i++) {
			//update export
			const pit = new Pit(data.pits[i].x, data.pits[i].y, 1);

			//update display
			grid[data.pits[i].id].marked = true;
			grid[data.pits[i].id].blockType = PIT;
			grid[data.pits[i].id].content = pit;

			exportedPits[data.pits[i].id] = grid[data.pits[i].id];
		}
	};

	const exportButton = document.getElementById("save");
	const uploadButton = document.getElementById("upload");

	const BACKGROUND_COLOR_STRONG = "#C2995D";
	const BACKGROUND_COLOR_WEAK = "#FFDFA8";

	//INIT CANVAS/
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;

	const gridWidth = CANVAS_WIDTH / boxSize;
	const gridHeight = CANVAS_HEIGHT / boxSize;
	const AREA = gridWidth * gridHeight;

	//init grid
	var x = 0;
	var y = 0;

	for (var i = 0; i < AREA; i++) {
		grid.push(new Box(x, y, boxSize, i));

		//if this box is on the side, automatically make it into a solid block
		if (x == 0 || x == CANVAS_WIDTH - boxSize || y == 0 || y == CANVAS_HEIGHT - boxSize) {
			const box = grid[i];
			box.marked = true;
			box.blockType = REGULAR_BLOCK;
			box.content = new Block(box.x, box.y, 1, REGULAR_BLOCK);
			exportedBlocks[box.id] = box;
		}

		if (x + boxSize == CANVAS_WIDTH) {
			x = 0;
			y += boxSize;
		} else {
			x += boxSize;
		}
	}

	player = new Player(1, 0);

	function globalStep() {
		globalUpdate();
		globalRender();
		requestAnimationFrame(globalStep);
	}
	requestAnimationFrame(globalStep);

	function globalUpdate() {
		//update grid items
		for (var i = 0; i < grid.length; i++) {
			grid[i].update();
		}

		//level not complete, grey out export button
		if (!player || exportedEnemies.length == 0) {
			exportButton.classList.remove("clickable-bottom-widget");
			exportButton.classList.add("locked-bottom-widget");
		} else {
			exportButton.classList.add("clickable-bottom-widget");
			exportButton.classList.remove("locked-bottom-widget");		
		}

		updateFloatingAssets();
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

		//render grid items
		for (var i = 0; i < grid.length; i++) {
			grid[i].render(ctx);
		}

		renderFloatingAssets();
	}

	function updateMousePos(clientX, clientY) {
		const rect = canvas.getBoundingClientRect();
		mouse = {
			x: clientX - rect.left,
			y: clientY - rect.top
		}
	}

	function uploadLevel() {
		//filter out bad requests
		if (uploadButton.files.length == 1) {
			fileReader.readAsText(uploadButton.files[0]);
		}
	}

	function exportAssets() {
		if (!player) {
			console.log("You MUST have a player in the game");
			return;
		}

		if (exportedEnemies.length == 0) {
			console.log("You MUST have at least one enemy tank in the game");
			return;
		}

		const levelExport = {
			player: player,
			enemies: exportedEnemies,
			blocks: [],
			pits: []
		};

		//eliminate null values to diminish json file size
		for (var blockID in exportedBlocks) {
			levelExport.blocks.push(exportedBlocks[blockID]);
		}

		for (var pitID in exportedPits) {
			levelExport.pits.push(exportedPits[pitID]);
		}

		var blob = new Blob([JSON.stringify(levelExport)],
			{type: "application/json"});
		saveAs(blob, "level.json");
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
		if (e.keyCode == 82) {
			//rotate the floating cache
			if (!editingBlocks) {
				if (floating_cache.content.tank.angle - (90 * Math.PI / 180) >= 2 * Math.PI) {
					floating_cache.content.tank.angle = 0;
				} else {
					floating_cache.content.tank.angle -= 90 * Math.PI / 180;
				}
			}		
		}
	});

	uploadButton.addEventListener("change", () => {
		uploadLevel();
	});

	exportButton.addEventListener("click", () => {
		exportAssets();
	});
})();