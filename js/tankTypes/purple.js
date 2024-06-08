class PurpleTank extends Bot {
	constructor(x, y, angle) {
		const speed = 240;
		const rotationSpeed = degreesToRadians(15);
		const stun = -5;
		const shellCap = 6;
		const shellCooldown = -6;
		const frm = -3;
		const stopAndTurn = degreesToRadians(35);
		const uTurn = degreesToRadians(160);
		const updateTargetCount = -1;
		const shellSensitivity = 700;
		const abortNonmove = false;
		const turretRotationSpeed = degreesToRadians(6);
		const turretArcSize = degreesToRadians(90);
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