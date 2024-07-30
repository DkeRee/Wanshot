class OrangeTank extends Bot {
	constructor(x, y, angle) {
		const speed = 20;
		const rotationSpeed = degreesToRadians(25);
		const stun = -5;
		const shellCap = 100;
		const shellCooldown = -3;
		const frm = -13;
		const stopAndTurn = degreesToRadians(35);
		const uTurn = degreesToRadians(160);
		const updateTargetCount = 0;
		const shellSensitivity = 800;
		const abortNonmove = true;
		const turretRotationSpeed = degreesToRadians(1);
		const turretArcSize = degreesToRadians(1);
		const shellType = MISSLE;
		const shellBounceAmount = 0;
		const color = "#FF8A14";
		const turretColor = "#D47311";
		const sideColor = "#B0896B";
		const tankID = Math.floor(Math.random() * 100000);
		const tankType = ORANGE_TANK;

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