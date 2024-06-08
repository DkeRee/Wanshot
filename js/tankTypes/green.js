class GreenTank extends Bot {
	constructor(x, y, angle) {
		const speed = 0;
		const rotationSpeed = 0;
		const stun = 0;
		const shellCap = 3;
		const shellCooldown = -10;
		const frm = 0;
		const stopAndTurn = 0;
		const uTurn = 0;
		const updateTargetCount = 0;
		const shellSensitivity = 0;
		const abortNonmove = false;
		const turretRotationSpeed = degreesToRadians(3);
		const turretArcSize = degreesToRadians(120);
		const shellType = ULTRA_MISSLE;
		const shellBounceAmount = 2;
		const color = "#3AB02E";
		const turretColor = "#37A62B";
		const sideColor = "#B0896B";
		const tankID = Math.floor(Math.random() * 100000);
		const tankType = GREEN_TANK;

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