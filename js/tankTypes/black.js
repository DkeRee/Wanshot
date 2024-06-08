class BlackTank extends Bot {
	constructor(x, y, angle) {
		const speed = 210;
		const rotationSpeed = degreesToRadians(10);
		const stun = -3;
		const shellCap = 5;
		const shellCooldown = -12;
		const frm = -3;
		const stopAndTurn = degreesToRadians(35);
		const uTurn = degreesToRadians(170);
		const updateTargetCount = -3
		const shellSensitivity = 1000;
		const abortNonmove = true;
		const turretRotationSpeed = degreesToRadians(10);
		const turretArcSize = degreesToRadians(45);
		const shellType = MISSLE;
		const shellBounceAmount = 0;
		const color = "#000000";
		const turretColor = "#000000";
		const sideColor = "#B0896B";
		const tankID = Math.floor(Math.random() * 100000);
		const tankType = BLACK_TANK;

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