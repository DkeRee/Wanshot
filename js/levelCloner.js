function levelCloner(CURR_LEVEL) {
	const LEVEL_CACHE = {};
	const LOCATED_LEVEL = LEVEL[CURR_LEVEL];

	for (asset in LOCATED_LEVEL) {
		switch (asset) {
			case "player":
				const player = LOCATED_LEVEL[asset];
				LEVEL_CACHE.player = new Player(player.tank.x, player.tank.y, player.tank.bodyAngle, player.tank.turretAngle);
				break;
			case "enemies":
				//will add enemy tank handler later on
				LEVEL_CACHE.enemies = [];
				break;
			case "shells":
				LEVEL_CACHE.shells = [];
				break;
			case "tracks":
				LEVEL_CACHE.tracks = [];
				break;
		}
	}

	return LEVEL_CACHE;
}