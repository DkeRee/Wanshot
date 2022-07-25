function getCampaign(CURR_CAMPAIGN, CURR_LEVEL) {
	switch (CURR_CAMPAIGN) {
		case NORMAL_CAMPAIGN:
			return NORMAL_LEVEL[CURR_LEVEL];
		case CHALLENGE_CAMPAIGN:
			return CHALLENGE_LEVEL[CURR_LEVEL];
		case CUSTOM_CAMPAIGN:
			return CUSTOM_LEVEL[CURR_LEVEL];
	}
}

function levelCloner(CURR_LEVEL) {
	const LEVEL_CACHE = {
		gameComplete: false,
		menuActivate: false,
		menuDelay: 0,
		confettiDelay: 0,
		confettiRing: 0,
		activateConfetti: false,
		confetti: [],
		player: null,
		violetProtection: [],
		enemies: [],
		shells: [],
		graves: [],
		tracks: [],
		tiles: [],
		pits: [],
		tileParticles: [],
		mines: []
	};
	
	//find desired level based on campaign selected
	const LOCATED_LEVEL = getCampaign(CURR_CAMPAIGN, CURR_LEVEL);	

	//set portals on lobby
	if (CURR_LEVEL == 0) {
		playPortal = new Portal(CANVAS_WIDTH / 2, 155, "#2A5BFF", "PLAY", 2.4, 25);
		challengePortal = new Portal(CANVAS_WIDTH / 4.3, 155, "#A62314", "CHALLENGE", 1.1, 45);
		customPortal = new Portal(CANVAS_WIDTH / 1.3, 155, "#95FC81", "CUSTOM", 1.5, 45);
	}

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
				break;
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
						case "YellowTank":
							LEVEL_CACHE.enemies.push(new YellowTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.turretAngle));
							break;
						case "PinkTank":
							LEVEL_CACHE.enemies.push(new PinkTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.turretAngle));
							break;
						case "TealTank":
							LEVEL_CACHE.enemies.push(new TealTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.turretAngle));
							break;
						case "PurpleTank":
							LEVEL_CACHE.enemies.push(new PurpleTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.turretAngle));
							break;
						case "WhiteTank":
							LEVEL_CACHE.enemies.push(new WhiteTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.turretAngle));	
							break;
						case "GreenTank":
							LEVEL_CACHE.enemies.push(new GreenTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.turretAngle));
							break;
						case "BlackTank":
							LEVEL_CACHE.enemies.push(new BlackTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.turretAngle));
							break;
						case "OrangeTank":
							LEVEL_CACHE.enemies.push(new OrangeTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.turretAngle));
							break;
						case "BlurpleTank":
							LEVEL_CACHE.enemies.push(new BlurpleTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.turretAngle));
							break;
						case "VioletTank":
							const violetTank = new VioletTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.turretAngle);
							LEVEL_CACHE.enemies.push(violetTank);

							//initiate protection zone for violet tank!
							LEVEL_CACHE.violetProtection.push(new ProtectionBubble(violetTank.tank.centerX, violetTank.tank.centerY, violetTank.tankID));
							break;
						case "TanTank":
							LEVEL_CACHE.enemies.push(new TanTank(enemies[i].tank.x, enemies[i].tank.y, enemies[i].tank.angle, enemies[i].tank.turretAngle));
							break;				
					}
				}
				break;
		}
	}

	return LEVEL_CACHE;
}