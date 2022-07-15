const canvasUIS = document.getElementsByClassName("widget-canvas");

//init canvases
for (var i = 0; i < canvasUIS.length; i++) {
	const cvs = canvasUIS[i];
	const name = cvs.id;
	const cvs_ctx = cvs.getContext("2d");

	cvs.width = 80;
	cvs.height = 80;

	switch (name) {
		case "solid-block":
			const solidBlock = new Block(40 - boxSize / 2, 40 - boxSize / 2, 1, REGULAR_BLOCK);
			solidBlock.render(cvs_ctx);

			document.getElementsByClassName("section-widget")[i].addEventListener("click", () => {
				currAsset = REGULAR_BLOCK;
				switchEditing(true);
			});
			break;
		case "breakable-block":
			const breakableBlock = new Block(40 - boxSize / 2, 40 - boxSize / 2, 1, LOOSE_BLOCK);
			breakableBlock.render(cvs_ctx);

			document.getElementsByClassName("section-widget")[i].addEventListener("click", () => {
				currAsset = LOOSE_BLOCK;
				switchEditing(true);
			});
			break;
		case "pit":
			const _pit = new Pit(40 - boxSize / 2, 40 - boxSize / 2, 1);
			_pit.render(cvs_ctx);

			document.getElementsByClassName("section-widget")[i].addEventListener("click", () => {
				currAsset = PIT;
				switchEditing(true);
			});
			break;
		case "Player":
			const _player = new Tank(38 - TANK_WIDTH / 2, 40 - TANK_HEIGHT / 2, 0, "#224ACF", "#1E42B8", "#0101BA", 1);
			_player.renderShadow(cvs_ctx);
			_player.render(cvs_ctx);

			document.getElementsByClassName("section-widget")[i].addEventListener("click", () => {
				currAsset = PLAYER;
				switchEditing(false);
			});
			break;
		case "BrownTank":
			const brownTank = new Tank(38 - TANK_WIDTH / 2, 40 - TANK_HEIGHT / 2, 0, "#966A4B", "#8C6346", "#B0896B", 1);
			brownTank.renderShadow(cvs_ctx);
			brownTank.render(cvs_ctx);

			document.getElementsByClassName("section-widget")[i].addEventListener("click", () => {
				currAsset = BROWN_TANK;
				switchEditing(false);
			});
			break;
		case "GreyTank":
			const greyTank = new Tank(38 - TANK_WIDTH / 2, 40 - TANK_HEIGHT / 2, 0, "#4A4A4A", "#4D4D4D", "#B0896B", 1);
			greyTank.renderShadow(cvs_ctx);
			greyTank.render(cvs_ctx);

			document.getElementsByClassName("section-widget")[i].addEventListener("click", () => {
				currAsset = GREY_TANK;
				switchEditing(false);
			});
			break;
		case "TealTank":
			const tealTank = new Tank(38 - TANK_WIDTH / 2, 40 - TANK_HEIGHT / 2, 0, "#154734", "#0E4732", "#B0896B", 1);
			tealTank.renderShadow(cvs_ctx);
			tealTank.render(cvs_ctx);

			document.getElementsByClassName("section-widget")[i].addEventListener("click", () => {
				currAsset = TEAL_TANK;
				switchEditing(false);
			});
			break;
		case "YellowTank":
			const yellowTank = new Tank(38 - TANK_WIDTH / 2, 40 - TANK_HEIGHT / 2, 0, "#DEC951", "#C4B248", "#B0896B", 1);
			yellowTank.renderShadow(cvs_ctx);
			yellowTank.render(cvs_ctx);

			document.getElementsByClassName("section-widget")[i].addEventListener("click", () => {
				currAsset = YELLOW_TANK;
				switchEditing(false);
			});
			break;
		case "PinkTank":
			const pinkTank = new Tank(38 - TANK_WIDTH / 2, 40 - TANK_HEIGHT / 2, 0, "#B82A55", "#B02951", "#B0896B", 1);
			pinkTank.renderShadow(cvs_ctx);
			pinkTank.render(cvs_ctx);

			document.getElementsByClassName("section-widget")[i].addEventListener("click", () => {
				currAsset = PINK_TANK;
				switchEditing(false);
			});	
			break;
		case "PurpleTank":
			const purpleTank = new Tank(38 - TANK_WIDTH / 2, 40 - TANK_HEIGHT / 2, 0, "#934A9E", "#80408A", "#B0896B", 1);
			purpleTank.renderShadow(cvs_ctx);
			purpleTank.render(cvs_ctx);

			document.getElementsByClassName("section-widget")[i].addEventListener("click", () => {
				currAsset = PURPLE_TANK;
				switchEditing(false);
			});
			break;
		case "GreenTank":
			const greenTank = new Tank(38 - TANK_WIDTH / 2, 40 - TANK_HEIGHT / 2, 0, "#3AB02E", "#37A62B", "#B0896B", 1);
			greenTank.renderShadow(cvs_ctx);
			greenTank.render(cvs_ctx);

			document.getElementsByClassName("section-widget")[i].addEventListener("click", () => {
				currAsset = GREEN_TANK;
				switchEditing(false);
			});
			break;
		case "WhiteTank":
			const whiteTank = new Tank(38 - TANK_WIDTH / 2, 40 - TANK_HEIGHT / 2, 0, "#DBDBDB", "#CFCFCF", "#B0896B", 1);
			whiteTank.renderShadow(cvs_ctx);
			whiteTank.render(cvs_ctx);

			document.getElementsByClassName("section-widget")[i].addEventListener("click", () => {
				currAsset = WHITE_TANK;
				switchEditing(false);
			});
			break;
	}
}