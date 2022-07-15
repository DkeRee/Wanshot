const fileReader = new FileReader();

fileReader.onload = function() {
	//parse JSON level data and load it into custom stage
	const data = JSON.parse(fileReader.result);

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
				LEVEL_CACHE.player = new Player(player.tank.x, player.tank.y, player.tank.angle, player.tank.angle);
				break;
			case "blocks":
				const tiles = data[asset];
				for (var i = 0; i < tiles.length; i++) {
					LEVEL_CACHE.tiles.push(new Block(tiles[i].x, tiles[i].y, tiles[i].content.kind));
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
							LEVEL_CACHE.enemies.push(new BrownTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.angle));
							break;
						case GREY_TANK:
							LEVEL_CACHE.enemies.push(new GreyTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.angle));
							break;
						case YELLOW_TANK:
							LEVEL_CACHE.enemies.push(new YellowTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.angle));
							break;
						case PINK_TANK:
							LEVEL_CACHE.enemies.push(new PinkTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.angle));
							break;
						case TEAL_TANK:
							LEVEL_CACHE.enemies.push(new TealTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.angle));
							break;
						case PURPLE_TANK:
							LEVEL_CACHE.enemies.push(new PurpleTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.angle));
							break;
						case WHITE_TANK:
							LEVEL_CACHE.enemies.push(new WhiteTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.angle));
							break;
						case GREEN_TANK:
							LEVEL_CACHE.enemies.push(new GreenTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.angle));
							break;
					}
				}
				break;
		}
	}

	playSound(importCustom);
	CUSTOM_LEVEL[1] = LEVEL_CACHE;
};