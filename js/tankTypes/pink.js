class PinkTank extends Bot {
	constructor(x, y, angle) {
		const speed = 140;
		const rotationSpeed = degreesToRadians(10);
		const stun = -5;
		const shellCap = 5;
		const shellCooldown = -20;
		const frm = -3;
		const stopAndTurn = degreesToRadians(30);
		const uTurn = degreesToRadians(170);
		const updateTargetCount = -3
		const shellSensitivity = 600;
		const abortNonmove = false;
		const turretRotationSpeed = degreesToRadians(3);
		const turretArcSize = degreesToRadians(95);
		const shellType = NORMAL_SHELL;
		const shellBounceAmount = 1;
		const color = "#B82A55";
		const turretColor = "#B02951";
		const sideColor = "#B0896B";
		const tankID = Math.floor(Math.random() * 100000);
		const tankType = PINK_TANK;

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