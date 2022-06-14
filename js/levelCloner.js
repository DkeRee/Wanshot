function levelCloner(CURR_LEVEL) {
	const LEVEL_CACHE = {
		player: null,
		enemies: [],
		shells: [],
		graves: [],
		tracks: [],
		tiles: [],
		pits: [],
		tileParticles: [],
		mines: []
	};
	const LOCATED_LEVEL = LEVEL[CURR_LEVEL];

	for (asset in LOCATED_LEVEL) {
		switch (asset) {
			case "player":
				const player = LOCATED_LEVEL[asset];
				LEVEL_CACHE.player = new Player(player.tank.x, player.tank.y, player.tank.angle, player.tank.turretAngle);
				break;
			case "tiles":
				const tiles = LOCATED_LEVEL[asset];
				for (var i = 0; i < tiles.length; i++) {
					LEVEL_CACHE.tiles.push(new Block(tiles[i].x, tiles[i].y, tiles[i].kind));
				} 
				break;
			case "pits":
				const pits = LOCATED_LEVEL[asset];
				for (var i = 0; i < pits.length; i++) {
					LEVEL_CACHE.pits.push(new Pit(pits[i].x, pits[i].y));
				}
			case "enemies":
				const enemies = LOCATED_LEVEL[asset];
				for (var i = 0; i < enemies.length; i++) {
					switch (enemies[i].constructor.name) {
						case "BrownTank":
							LEVEL_CACHE.enemies.push(new BrownTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.turretAngle));
							break;
						case "GreyTank":
							LEVEL_CACHE.enemies.push(new GreyTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.turretAngle));
							break;
					}
				}
				break;
		}
	}

	return LEVEL_CACHE;
}