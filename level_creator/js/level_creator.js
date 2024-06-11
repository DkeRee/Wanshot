(function() {
	const stageNotif = document.getElementById("stage-notif");
	var currStage = 1;
	var totalStage = 1;

	//init
	function clearGrid(makeBorders) {
		var x = 0;
		var y = 0;

		grid = [];

		for (var i = 0; i < AREA; i++) {
			grid.push(new Box(x, y, boxSize, i));

			if (makeBorders) {
				//if this box is on the side, automatically make it into a solid block
				if (x == 0 || x == CANVAS_WIDTH - boxSize || y == 0 || y == CANVAS_HEIGHT - boxSize) {
					const box = grid[i];
					box.marked = true;
					box.blockType = REGULAR_BLOCK;
					box.content = new Block(box.x, box.y, 1, REGULAR_BLOCK);
					CAMPAIGN[campaignIndex].exportedBlocks[box.id] = box;
				}
			}

			if (x + boxSize == CANVAS_WIDTH) {
				x = 0;
				y += boxSize;
			} else {
				x += boxSize;
			}
		}
	}

	function switchStage(newIndex) {
		if (newIndex < 0 || newIndex > 99) return;

		var makeFreshBorders = false;
		currStage = newIndex + 1;

		if (newIndex == CAMPAIGN.length) {
			//create new level
			CAMPAIGN.push(new Stage());
			totalStage++;
			makeFreshBorders = true;
		}

		campaignIndex = newIndex;
		clearGrid(makeFreshBorders);

		//note: canvas automatically renders campaignIndex tanks, but not blocks
		CAMPAIGN[campaignIndex].loadCanvasBlocks();

		//DOM stuff
		stageNotif.textContent = currStage + "/" + totalStage;

		if (newIndex - 1 < 0) {
			leftArrow.classList.remove("clickable-bottom-widget");
			leftArrow.classList.add("locked-bottom-widget");
		} else {
			leftArrow.classList.remove("locked-bottom-widget");
			leftArrow.classList.add("clickable-bottom-widget");
		}

		if (newIndex + 1 > 99) {
			rightArrow.classList.remove("clickable-bottom-widget");
			rightArrow.classList.add("locked-bottom-widget");
		} else {
			rightArrow.classList.remove("locked-bottom-widget");
			rightArrow.classList.add("clickable-bottom-widget");
		}
	}

	const fileReader = new FileReader();

	fileReader.onload = function() {
		const campaign = JSON.parse(fileReader.result);

		//reset
		switchEditing(true);

		clearGrid(false);

		CAMPAIGN = [];
		holding = false;

		//test for old files
		if (campaign.player) {
			campaignIndex = 0;

			const stage = new Stage();
			stage.loadSelfChunk(campaign);

			CAMPAIGN.push(stage);
			CAMPAIGN[campaignIndex].loadCanvasBlocks();
			return;
		}

		campaignIndex = campaign.length - 1;
		for (var i = 0; i < campaign.length; i++) {
			const stage = new Stage();
			stage.loadSelfChunk(campaign[i]);
			CAMPAIGN.push(stage);
		}

		CAMPAIGN[campaignIndex].loadCanvasBlocks();
	};

	const exportButton = document.getElementById("save");
	const uploadButton = document.getElementById("upload");

	const BACKGROUND_COLOR_STRONG = "#C2995D";
	const BACKGROUND_COLOR_WEAK = "#FFDFA8";

	//INIT CANVAS/
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;

	//Add in default first stage
	CAMPAIGN.push(new Stage());
	clearGrid(true);

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
		for (var i = 0; i < CAMPAIGN.length; i++) {
			if (!CAMPAIGN[i].player || CAMPAIGN[i].exportedEnemies.length == 0) {
				exportButton.classList.remove("clickable-bottom-widget");
				exportButton.classList.add("locked-bottom-widget");
				break;
			} 

			if (CAMPAIGN.length - 1 == i) {
				exportButton.classList.add("clickable-bottom-widget");
				exportButton.classList.remove("locked-bottom-widget");
			}
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
		const campaignExport = [];

		for (var i = 0; i < CAMPAIGN.length; i++) {
			const player = CAMPAIGN[i].player;
			const exportedEnemies = CAMPAIGN[i].exportedEnemies;
			const exportedBlocks = CAMPAIGN[i].exportedBlocks;
			const exportedPits = CAMPAIGN[i].exportedPits;

			if (!player) {
				//console.log("You MUST have a player in the game");
				return;
			}

			if (exportedEnemies.length == 0) {
				//console.log("You MUST have at least one enemy tank in the game");
				return;
			}

			const stageExport = {
				player: {
					x: player.tank.x,
					y: player.tank.y,
					angle: player.tank.angle
				},
				enemies: [],
				blocks: [],
				pits: []
			};

			for (var enemyID in exportedEnemies) {
				const enemy = exportedEnemies[enemyID];
				stageExport.enemies.push({
					x: enemy.tank.x,
					y: enemy.tank.y,
					angle: enemy.tank.angle,
					content: enemy.content
				});
			}

			//eliminate null values to diminish json file size
			for (var blockID in exportedBlocks) {
				const block = exportedBlocks[blockID];
				stageExport.blocks.push({
					x: block.x,
					y: block.y,
					kind: block.content.kind
				});
			}

			for (var pitID in exportedPits) {
				const pit = exportedPits[pitID];
				stageExport.pits.push({
					x: pit.x,
					y: pit.y
				});
			}

			campaignExport.push(stageExport);
		}

		var blob = new Blob([JSON.stringify(campaignExport)],
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

		if (e.keyCode == 39) {
			switchStage(campaignIndex + 1);
		}

		if (e.keyCode == 37) {
			switchStage(campaignIndex - 1);
		}
	});

	leftArrow.addEventListener("mousedown", () => {
		switchStage(campaignIndex - 1);
	});

	uploadButton.addEventListener("change", () => {
		uploadLevel();
	});

	exportButton.addEventListener("click", () => {
		exportAssets();
	});

	rightArrow.addEventListener("mousedown", () => {
		switchStage(campaignIndex + 1);
	});
})();