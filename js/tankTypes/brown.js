class BrownTank extends Bot {
	constructor(x, y, angle) {
		const speed = 0;
		const rotationSpeed = 0;
		const stun = 0;
		const shellCap = 1;
		const shellCooldown = -1500;
		const frm = 0;
		const stopAndTurn = 0;
		const uTurn = 0;
		const updateTargetCount = 0;
		const shellSensitivity = 0;
		const abortNonmove = false;
		const turretRotationSpeed = degreesToRadians(2);
		const turretArcSize = degreesToRadians(180);
		const shellType = NORMAL_SHELL;
		const shellBounceAmount = 1;
		const color = "#966A4B";
		const turretColor = "#8C6346";
		const sideColor = "#B0896B";
		const tankID = Math.floor(Math.random() * 100000);
		const tankType = BROWN_TANK;

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