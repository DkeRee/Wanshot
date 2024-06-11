function createStage(data) {
	const LEVEL_CACHE = {
		player: null,
		enemies: [],
		tiles: [],
		pits: []
	};

	for (asset in data) {
		switch (asset) {
			case "player":
				const player = data[asset];
				LEVEL_CACHE.player = new Player(player.x, player.y, player.angle, player.angle);
				break;
			case "blocks":
				const tiles = data[asset];
				for (var i = 0; i < tiles.length; i++) {
					LEVEL_CACHE.tiles.push(new Block(tiles[i].x, tiles[i].y, tiles[i].kind));
				} 
				break;
			case "pits":
				const pits = data[asset];
				for (var i = 0; i < pits.length; i++) {
					LEVEL_CACHE.pits.push(new Pit(pits[i].x, pits[i].y));
				}
				break;
			case "enemies":
				const enemies = data[asset];
				for (var i = 0; i < enemies.length; i++) {
					switch (enemies[i].content) {
						case BROWN_TANK:
							LEVEL_CACHE.enemies.push(new BrownTank(enemies[i].x, enemies[i].y, enemies[i].angle));
							break;
						case GREY_TANK:
							LEVEL_CACHE.enemies.push(new GreyTank(enemies[i].x, enemies[i].y, enemies[i].angle));
							break;
						case YELLOW_TANK:
							LEVEL_CACHE.enemies.push(new YellowTank(enemies[i].x, enemies[i].y, enemies[i].angle));
							break;
						case PINK_TANK:
							LEVEL_CACHE.enemies.push(new PinkTank(enemies[i].x, enemies[i].y, enemies[i].angle));
							break;
						case TEAL_TANK:
							LEVEL_CACHE.enemies.push(new TealTank(enemies[i].x, enemies[i].y, enemies[i].angle));
							break;
						case PURPLE_TANK:
							LEVEL_CACHE.enemies.push(new PurpleTank(enemies[i].x, enemies[i].y, enemies[i].angle));
							break;
						case WHITE_TANK:
							LEVEL_CACHE.enemies.push(new WhiteTank(enemies[i].x, enemies[i].y, enemies[i].angle));
							break;
						case GREEN_TANK:
							LEVEL_CACHE.enemies.push(new GreenTank(enemies[i].x, enemies[i].y, enemies[i].angle));
							break;
						case BLACK_TANK:
							LEVEL_CACHE.enemies.push(new BlackTank(enemies[i].x, enemies[i].y, enemies[i].angle));
							break;
						case ORANGE_TANK:
							LEVEL_CACHE.enemies.push(new OrangeTank(enemies[i].x, enemies[i].y, enemies[i].angle));
							break;
						case BLURPLE_TANK:
							LEVEL_CACHE.enemies.push(new BlurpleTank(enemies[i].x, enemies[i].y, enemies[i].angle));
							break;
						case VIOLET_TANK:
							LEVEL_CACHE.enemies.push(new VioletTank(enemies[i].x, enemies[i].y, enemies[i].angle));
							break;
						case TAN_TANK:
							LEVEL_CACHE.enemies.push(new TanTank(enemies[i].x, enemies[i].y, enemies[i].angle));
							break;																
					}
				}
				break;
		}
	}

	return LEVEL_CACHE;
}

const fileReader = new FileReader();

fileReader.onload = function() {
	//parse JSON level data and load it into custom stage
	const campaign = JSON.parse(fileReader.result);

	//test for old levels
	if (campaign.player) {
		CUSTOM_LEVEL[1] = createStage(campaign);
	} else {
		for (var i = 0; i < campaign.length; i++) {
			CUSTOM_LEVEL[i + 1] = createStage(campaign[i]);
		}
	}

	playSound(importCustom);
};