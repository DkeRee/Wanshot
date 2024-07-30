class TealTank extends Bot {
	constructor(x, y, angle) {
		const speed = 70;
		const rotationSpeed = degreesToRadians(20);
		const stun = -30;
		const shellCap = 1;
		const shellCooldown = -150;
		const frm = -9;
		const stopAndTurn = degreesToRadians(35);
		const uTurn = degreesToRadians(160);
		const updateTargetCount = -2;
		const shellSensitivity = 800;
		const abortNonmove = false;
		const turretRotationSpeed = degreesToRadians(1);
		const turretArcSize = degreesToRadians(1);
		const shellType = MISSLE;
		const shellBounceAmount = 0;
		const color = "#427D72";
		const turretColor = "#427d6d";
		const sideColor = "#B0896B";
		const tankID = Math.floor(Math.random() * 100000);
		const tankType = TEAL_TANK;

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