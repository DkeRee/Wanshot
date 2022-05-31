function levelCloner(CURR_LEVEL) {
	const LEVEL_CACHE = {
		shells: [],
		graves: [],
		tracks: []
	};
	const LOCATED_LEVEL = LEVEL[CURR_LEVEL];

	for (asset in LOCATED_LEVEL) {
		switch (asset) {
			case "player":
				const player = LOCATED_LEVEL[asset];
				LEVEL_CACHE.player = new Player(player.tank.x, player.tank.y, player.tank.angle, player.tank.turretAngle);
				break;
			case "enemies":
				//will add enemy tank handler later on
				LEVEL_CACHE.enemies = [];
				break;
		}
	}

	return LEVEL_CACHE;
}