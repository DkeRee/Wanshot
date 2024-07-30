class PurpleTank extends Bot {
	constructor(x, y, angle) {
		const speed = 160;
		const rotationSpeed = degreesToRadians(13);
		const stun = -3;
		const shellCap = 10;
		const shellCooldown = -3;
		const frm = -3;
		const stopAndTurn = degreesToRadians(35);
		const uTurn = degreesToRadians(160);
		const updateTargetCount = -3;
		const shellSensitivity = 620;
		const abortNonmove = false;
		const turretRotationSpeed = degreesToRadians(3);
		const turretArcSize = degreesToRadians(60);
		const shellType = NORMAL_SHELL;
		const shellBounceAmount = 1;
		const color = "#934A9E";
		const turretColor = "#80408A";
		const sideColor = "#B0896B";
		const tankID = Math.floor(Math.random() * 100000);
		const tankType = PURPLE_TANK;

		super(
			x,
			y,
			angle,
			speed,
			rotationSpeed,
			stun,
			shellCap,
			shellCooldown,
			frm,
			stopAndTurn,
			uTurn,
			updateTargetCount,
			shellSensitivity,
			abortNonmove,
			turretRotationSpeed,
			turretArcSize,
			shellType,
			shellBounceAmount,
			color,
			turretColor,
			sideColor,
			tankID,
			tankType
			);
	}
}